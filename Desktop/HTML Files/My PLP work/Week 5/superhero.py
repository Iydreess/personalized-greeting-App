"""
Superhero class demonstrating inheritance from Person class
- Inheritance: Inherits all attributes and methods from Person
- Method overriding: Overrides some methods for superhero-specific behavior
- Additional attributes and methods specific to superheroes
"""

from person import Person

class Superhero(Person):
    def __init__(self, name, age, gender, hero_name, powers, weakness=None):
        """Constructor that calls parent constructor and adds superhero-specific attributes"""
        super().__init__(name, age, gender)  # Call parent constructor
        self.__hero_name = hero_name  # Private superhero name
        self.__powers = powers if isinstance(powers, list) else [powers]  # Private powers list
        self.__weakness = weakness  # Private weakness
        self._energy = 100  # Protected energy attribute
        self.__secret_identity_revealed = False  # Private attribute
    
    # Getter methods for superhero-specific attributes
    def get_hero_name(self):
        """Get the superhero name"""
        return self.__hero_name
    
    def get_powers(self):
        """Get the list of powers"""
        return self.__powers.copy()  # Return copy to prevent external modification
    
    def get_weakness(self):
        """Get the superhero's weakness"""
        return self.__weakness
    
    def get_energy(self):
        """Get the superhero's energy level"""
        return self._energy
    
    def is_identity_revealed(self):
        """Check if secret identity is revealed"""
        return self.__secret_identity_revealed
    
    # Setter methods
    def set_hero_name(self, hero_name):
        """Set the superhero name"""
        if isinstance(hero_name, str) and len(hero_name) > 0:
            self.__hero_name = hero_name
        else:
            print("Invalid hero name!")
    
    def add_power(self, power):
        """Add a new power to the superhero"""
        if power not in self.__powers:
            self.__powers.append(power)
            print(f"{self.__hero_name} gained new power: {power}")
        else:
            print(f"{self.__hero_name} already has the power: {power}")
    
    def set_energy(self, energy):
        """Set the superhero's energy level"""
        if 0 <= energy <= 100:
            self._energy = energy
        else:
            print("Energy must be between 0 and 100!")
    
    def reveal_identity(self):
        """Reveal the secret identity"""
        self.__secret_identity_revealed = True
        print(f"BREAKING NEWS: {self.__hero_name} is actually {self.get_name()}!")
    
    # Method overriding - Polymorphism
    def introduce(self):
        """Override parent's introduce method"""
        if self.__secret_identity_revealed:
            return f"Hi, I'm {self.get_name()}, also known as {self.__hero_name}!"
        else:
            return f"I am {self.__hero_name}, protector of the innocent!"
    
    # New methods specific to superheroes
    def use_power(self, power_name, energy_cost=10):
        """Use a specific power"""
        if power_name in self.__powers:
            if self._energy >= energy_cost:
                self._energy -= energy_cost
                print(f"{self.__hero_name} uses {power_name}! Energy remaining: {self._energy}")
                return True
            else:
                print(f"{self.__hero_name} doesn't have enough energy to use {power_name}!")
                return False
        else:
            print(f"{self.__hero_name} doesn't have the power: {power_name}")
            return False
    
    def rest(self, energy_gain=20):
        """Rest to regain energy"""
        self._energy = min(100, self._energy + energy_gain)
        print(f"{self.__hero_name} rests and regains energy. Energy: {self._energy}")
    
    def save_citizen(self):
        """Save a citizen - uses energy"""
        if self.use_power("rescue", 15):
            print(f"{self.__hero_name} heroically saves a citizen!")
            return True
        return False
    
    def fight_villain(self, villain_name):
        """Fight a villain"""
        if self._energy >= 25:
            self._energy -= 25
            print(f"{self.__hero_name} fights {villain_name}! Energy remaining: {self._energy}")
            # Check if weakness is exploited
            if self.__weakness and self.__weakness.lower() in villain_name.lower():
                print(f"Oh no! {villain_name} exploited {self.__hero_name}'s weakness: {self.__weakness}!")
                self.take_damage(30)
                return False
            else:
                print(f"{self.__hero_name} defeats {villain_name}!")
                return True
        else:
            print(f"{self.__hero_name} is too tired to fight!")
            return False
    
    # Override string methods
    def __str__(self):
        """String representation of the superhero"""
        identity = f"({self.get_name()})" if self.__secret_identity_revealed else "(Secret Identity)"
        return f"Superhero: {self.__hero_name} {identity}, Powers: {', '.join(self.__powers)}, Energy: {self._energy}"
    
    def __repr__(self):
        """Developer-friendly representation"""
        return f"Superhero('{self.get_name()}', {self.get_age()}, '{self.get_gender()}', '{self.__hero_name}', {self.__powers})"
