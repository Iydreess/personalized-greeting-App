"""
FlyingHero class demonstrating further inheritance and polymorphism
- Inherits from Superhero class
- Adds flying-specific abilities and attributes
- Demonstrates method overriding for specialized behavior
"""

from superhero import Superhero

class FlyingHero(Superhero):
    def __init__(self, name, age, gender, hero_name, powers, weakness=None, max_altitude=10000):
        """Constructor for flying superhero"""
        # Ensure flight is in powers
        if isinstance(powers, list):
            if "flight" not in powers:
                powers.append("flight")
        else:
            powers = [powers, "flight"]
        
        super().__init__(name, age, gender, hero_name, powers, weakness)
        self.__max_altitude = max_altitude  # Private max flying altitude
        self.__current_altitude = 0  # Private current altitude
        self.__is_flying = False  # Private flying status
    
    # Getter methods for flying-specific attributes
    def get_max_altitude(self):
        """Get maximum flying altitude"""
        return self.__max_altitude
    
    def get_current_altitude(self):
        """Get current altitude"""
        return self.__current_altitude
    
    def is_flying(self):
        """Check if hero is currently flying"""
        return self.__is_flying
    
    # Flying-specific methods
    def take_off(self):
        """Take off and start flying"""
        if not self.__is_flying:
            if self.use_power("flight", 5):
                self.__is_flying = True
                self.__current_altitude = 100  # Start at 100 feet
                print(f"{self.get_hero_name()} takes off and starts flying at {self.__current_altitude} feet!")
                return True
        else:
            print(f"{self.get_hero_name()} is already flying!")
        return False
    
    def land(self):
        """Land and stop flying"""
        if self.__is_flying:
            self.__is_flying = False
            self.__current_altitude = 0
            print(f"{self.get_hero_name()} lands safely on the ground.")
            return True
        else:
            print(f"{self.get_hero_name()} is already on the ground!")
            return False
    
    def fly_to_altitude(self, target_altitude):
        """Fly to a specific altitude"""
        if not self.__is_flying:
            print(f"{self.get_hero_name()} must take off first!")
            return False
        
        if target_altitude > self.__max_altitude:
            print(f"{self.get_hero_name()} cannot fly above {self.__max_altitude} feet!")
            return False
        
        if target_altitude < 0:
            print("Cannot fly below ground level!")
            return False
        
        energy_cost = abs(target_altitude - self.__current_altitude) // 100  # 1 energy per 100 feet
        if self.get_energy() >= energy_cost:
            self.set_energy(self.get_energy() - energy_cost)
            self.__current_altitude = target_altitude
            print(f"{self.get_hero_name()} flies to {target_altitude} feet. Energy: {self.get_energy()}")
            return True
        else:
            print(f"{self.get_hero_name()} doesn't have enough energy to change altitude!")
            return False
    
    def aerial_rescue(self, rescue_altitude=500):
        """Perform an aerial rescue"""
        if not self.__is_flying:
            if not self.take_off():
                return False
        
        if self.fly_to_altitude(rescue_altitude):
            if self.use_power("rescue", 20):
                print(f"{self.get_hero_name()} performs a daring aerial rescue at {rescue_altitude} feet!")
                return True
        return False
    
    def sky_patrol(self, patrol_altitude=1000):
        """Patrol the skies"""
        if not self.__is_flying:
            if not self.take_off():
                return False
        
        if self.fly_to_altitude(patrol_altitude):
            energy_cost = 15
            if self.get_energy() >= energy_cost:
                self.set_energy(self.get_energy() - energy_cost)
                print(f"{self.get_hero_name()} patrols the skies at {patrol_altitude} feet, watching for trouble.")
                return True
            else:
                print(f"{self.get_hero_name()} is too tired to patrol!")
        return False
    
    # Override fight_villain to include aerial combat
    def fight_villain(self, villain_name, aerial_combat=False):
        """Fight a villain with option for aerial combat"""
        if aerial_combat:
            if not self.__is_flying:
                print(f"{self.get_hero_name()} takes to the skies for aerial combat!")
                if not self.take_off():
                    return False
            
            if self.fly_to_altitude(500):  # Fight at 500 feet
                print(f"{self.get_hero_name()} engages {villain_name} in aerial combat!")
                # Aerial combat uses more energy but is more effective
                if self.get_energy() >= 30:
                    self.set_energy(self.get_energy() - 30)
                    print(f"Aerial advantage! {self.get_hero_name()} has the upper hand!")
                    return super().fight_villain(villain_name)
                else:
                    print(f"{self.get_hero_name()} is too tired for aerial combat!")
                    return False
        else:
            # Regular ground combat
            return super().fight_villain(villain_name)
    
    # Override rest method to include landing
    def rest(self, energy_gain=20):
        """Rest and regain energy (lands if flying)"""
        if self.__is_flying:
            print(f"{self.get_hero_name()} lands to rest properly.")
            self.land()
        super().rest(energy_gain)
    
    # Override string representation
    def __str__(self):
        """String representation of the flying hero"""
        base_str = super().__str__()
        flying_status = f"Flying at {self.__current_altitude} feet" if self.__is_flying else "On ground"
        return f"{base_str}, Status: {flying_status}, Max Altitude: {self.__max_altitude} feet"
