"""
TechHero class demonstrating polymorphism and specialized superhero abilities
- Inherits from Superhero class
- Focuses on technology-based powers and gadgets
- Demonstrates different implementation of similar methods
"""

from superhero import Superhero

class TechHero(Superhero):
    def __init__(self, name, age, gender, hero_name, powers, weakness=None, intelligence_level=85):
        """Constructor for tech-based superhero"""
        # Ensure technology powers are included
        tech_powers = ["technology", "gadgets", "hacking"]
        if isinstance(powers, list):
            powers.extend([p for p in tech_powers if p not in powers])
        else:
            powers = [powers] + tech_powers
        
        super().__init__(name, age, gender, hero_name, powers, weakness)
        self.__intelligence_level = intelligence_level  # Private intelligence stat
        self.__gadgets = []  # Private list of gadgets
        self.__suit_power = 100  # Private suit power level
        self.__hacking_tools_active = False  # Private hacking status
        
        # Start with basic gadgets
        self.__gadgets = ["Communication Device", "Scanner", "Emergency Beacon"]
    
    # Getter methods for tech-specific attributes
    def get_intelligence_level(self):
        """Get intelligence level"""
        return self.__intelligence_level
    
    def get_gadgets(self):
        """Get list of available gadgets"""
        return self.__gadgets.copy()
    
    def get_suit_power(self):
        """Get current suit power level"""
        return self.__suit_power
    
    def is_hacking_tools_active(self):
        """Check if hacking tools are active"""
        return self.__hacking_tools_active
    
    # Tech-specific methods
    def add_gadget(self, gadget_name):
        """Add a new gadget to inventory"""
        if gadget_name not in self.__gadgets:
            self.__gadgets.append(gadget_name)
            print(f"{self.get_hero_name()} acquires new gadget: {gadget_name}")
        else:
            print(f"{self.get_hero_name()} already has: {gadget_name}")
    
    def use_gadget(self, gadget_name, suit_power_cost=5):
        """Use a specific gadget"""
        if gadget_name in self.__gadgets:
            if self.__suit_power >= suit_power_cost:
                self.__suit_power -= suit_power_cost
                print(f"{self.get_hero_name()} uses {gadget_name}! Suit power: {self.__suit_power}%")
                return True
            else:
                print(f"{self.get_hero_name()}'s suit doesn't have enough power for {gadget_name}!")
                return False
        else:
            print(f"{self.get_hero_name()} doesn't have gadget: {gadget_name}")
            return False
    
    def hack_system(self, system_name):
        """Hack into a system"""
        if not self.__hacking_tools_active:
            self.activate_hacking_tools()
        
        hack_difficulty = 20  # Base difficulty
        success_chance = self.__intelligence_level + (10 if "Hacking Device" in self.__gadgets else 0)
        
        if self.use_power("hacking", 15):
            if success_chance >= hack_difficulty:
                print(f"{self.get_hero_name()} successfully hacks into {system_name}!")
                return True
            else:
                print(f"{self.get_hero_name()} failed to hack {system_name}. Need higher intelligence or better tools.")
                return False
        return False
    
    def activate_hacking_tools(self):
        """Activate advanced hacking tools"""
        if self.use_gadget("Scanner", 10):
            self.__hacking_tools_active = True
            print(f"{self.get_hero_name()} activates advanced hacking tools!")
            return True
        return False
    
    def scan_area(self, area_name):
        """Scan an area for threats or information"""
        if self.use_gadget("Scanner", 8):
            threats_found = ["Security Camera", "Motion Sensor", "Hidden Door"]
            print(f"{self.get_hero_name()} scans {area_name} and finds: {', '.join(threats_found)}")
            return threats_found
        return []
    
    def tech_rescue(self, rescue_type="standard"):
        """Perform a technology-assisted rescue"""
        if rescue_type == "building_collapse":
            gadgets_needed = ["Scanner", "Communication Device"]
            if all(gadget in self.__gadgets for gadget in gadgets_needed):
                if self.use_gadget("Scanner", 15) and self.use_power("technology", 20):
                    print(f"{self.get_hero_name()} uses thermal scanning to locate survivors!")
                    print(f"Coordinating rescue with emergency services via communication device!")
                    return True
        elif rescue_type == "cyber_attack":
            if self.hack_system("Emergency Systems"):
                print(f"{self.get_hero_name()} stops the cyber attack and restores systems!")
                return True
        else:
            # Standard rescue with tech assistance
            if self.use_gadget("Emergency Beacon", 10):
                return self.save_citizen()
        return False
    
    def recharge_suit(self, recharge_amount=30):
        """Recharge the tech suit"""
        self.__suit_power = min(100, self.__suit_power + recharge_amount)
        print(f"{self.get_hero_name()}'s suit recharges. Power level: {self.__suit_power}%")
    
    def upgrade_intelligence(self, upgrade_points=5):
        """Upgrade intelligence level"""
        if self.__intelligence_level < 100:
            old_level = self.__intelligence_level
            self.__intelligence_level = min(100, self.__intelligence_level + upgrade_points)
            print(f"{self.get_hero_name()}'s intelligence increased from {old_level} to {self.__intelligence_level}!")
        else:
            print(f"{self.get_hero_name()} has reached maximum intelligence level!")
    
    # Override fight_villain for tech-based combat
    def fight_villain(self, villain_name):
        """Fight a villain using technology"""
        print(f"{self.get_hero_name()} analyzes {villain_name} with advanced scanners...")
        
        if self.scan_area(f"{villain_name}'s location"):
            if "Cyber" in villain_name or "Tech" in villain_name:
                # Tech vs Tech battle
                print(f"Tech battle detected! {self.get_hero_name()} initiates cyber warfare!")
                if self.hack_system(f"{villain_name}'s systems"):
                    print(f"{self.get_hero_name()} disables {villain_name}'s technology!")
                    return True
                else:
                    return super().fight_villain(villain_name)
            else:
                # Use gadgets to assist in regular combat
                if self.use_gadget("Scanner") and self.use_gadget("Communication Device"):
                    print(f"{self.get_hero_name()} uses tactical analysis and coordination!")
                    return super().fight_villain(villain_name)
        
        return super().fight_villain(villain_name)
    
    # Override rest method to include suit recharging
    def rest(self, energy_gain=20):
        """Rest and recharge both energy and suit"""
        super().rest(energy_gain)
        self.recharge_suit(25)
        self.__hacking_tools_active = False  # Reset hacking tools
    
    # Override string representation
    def __str__(self):
        """String representation of the tech hero"""
        base_str = super().__str__()
        return f"{base_str}, Intelligence: {self.__intelligence_level}, Suit Power: {self.__suit_power}%, Gadgets: {len(self.__gadgets)}"
