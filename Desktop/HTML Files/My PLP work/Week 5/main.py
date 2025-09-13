"""
Main demonstration file showing all OOP concepts working together
- Inheritance: Multiple levels of class inheritance
- Polymorphism: Same methods behaving differently in different classes
- Encapsulation: Private attributes accessed through methods
- Constructors: Unique object initialization
"""

from person import Person
from superhero import Superhero
from flying_hero import FlyingHero
from tech_hero import TechHero

def demonstrate_basic_person():
    """Demonstrate basic Person class functionality"""
    print("=" * 60)
    print("DEMONSTRATING BASIC PERSON CLASS")
    print("=" * 60)
    
    # Create a regular person using constructor
    person1 = Person("Alice Johnson", 28, "Female")
    print(f"Created: {person1}")
    
    # Demonstrate encapsulation (getters)
    print(f"Name: {person1.get_name()}")
    print(f"Age: {person1.get_age()}")
    print(f"Health: {person1.get_health()}")
    
    # Demonstrate methods
    print(person1.introduce())
    person1.celebrate_birthday()
    person1.take_damage(20)
    person1.heal(10)
    
    # Demonstrate encapsulation (setters with validation)
    person1.set_name("Alice Smith")
    person1.set_age(-5)  # This should fail validation
    print(f"Final state: {person1}")
    print()

def demonstrate_basic_superhero():
    """Demonstrate Superhero class with inheritance"""
    print("=" * 60)
    print("DEMONSTRATING SUPERHERO CLASS (INHERITANCE)")
    print("=" * 60)
    
    # Create superhero using constructor
    hero1 = Superhero("Diana Prince", 30, "Female", "Wonder Woman", 
                     ["Super Strength", "Lasso of Truth", "Flight"], "Magic")
    
    print(f"Created: {hero1}")
    
    # Demonstrate inherited methods
    print(hero1.introduce())  # This is overridden (polymorphism)
    
    # Demonstrate superhero-specific methods
    hero1.use_power("Super Strength")
    hero1.add_power("Invisible Jet")
    hero1.save_citizen()
    hero1.fight_villain("Ares")  # Fighting a magic-based villain (exploits weakness)
    hero1.fight_villain("Cheetah")  # Regular villain
    
    # Demonstrate encapsulation
    print(f"Hero Name: {hero1.get_hero_name()}")
    print(f"Powers: {hero1.get_powers()}")
    print(f"Energy: {hero1.get_energy()}")
    
    hero1.rest()
    hero1.reveal_identity()
    print(hero1.introduce())  # Different output after identity reveal
    print()

def demonstrate_flying_hero():
    """Demonstrate FlyingHero class with multiple inheritance levels"""
    print("=" * 60)
    print("DEMONSTRATING FLYING HERO CLASS (POLYMORPHISM)")
    print("=" * 60)
    
    # Create flying hero
    flying_hero = FlyingHero("Clark Kent", 32, "Male", "Superman", 
                           ["Super Strength", "Heat Vision", "X-Ray Vision"], 
                           "Kryptonite", max_altitude=50000)
    
    print(f"Created: {flying_hero}")
    
    # Demonstrate flying-specific abilities
    flying_hero.take_off()
    flying_hero.fly_to_altitude(1000)
    flying_hero.sky_patrol(2000)
    flying_hero.aerial_rescue(800)
    
    # Demonstrate polymorphism - same method, different behavior
    flying_hero.fight_villain("Lex Luthor", aerial_combat=True)
    flying_hero.fight_villain("General Zod", aerial_combat=False)
    
    # Demonstrate inherited methods working with new attributes
    flying_hero.rest()  # This also lands the hero
    print(f"Flying status: {flying_hero.is_flying()}")
    print()

def demonstrate_tech_hero():
    """Demonstrate TechHero class showing different polymorphic behavior"""
    print("=" * 60)
    print("DEMONSTRATING TECH HERO CLASS (DIFFERENT POLYMORPHISM)")
    print("=" * 60)
    
    # Create tech hero
    tech_hero = TechHero("Tony Stark", 45, "Male", "Iron Man", 
                        ["Genius Intellect", "Powered Armor"], "EMP", 
                        intelligence_level=95)
    
    print(f"Created: {tech_hero}")
    
    # Demonstrate tech-specific abilities
    tech_hero.add_gadget("Repulsors")
    tech_hero.add_gadget("Arc Reactor")
    tech_hero.add_gadget("Hacking Device")
    
    print(f"Available gadgets: {tech_hero.get_gadgets()}")
    
    tech_hero.scan_area("Stark Tower")
    tech_hero.hack_system("Security Network")
    tech_hero.tech_rescue("building_collapse")
    tech_hero.tech_rescue("cyber_attack")
    
    # Demonstrate polymorphism - same fight method, different implementation
    tech_hero.fight_villain("Cyber Criminal")
    tech_hero.fight_villain("The Mandarin")
    
    tech_hero.upgrade_intelligence(3)
    tech_hero.rest()  # Also recharges suit
    print()

def demonstrate_polymorphism():
    """Demonstrate polymorphism with different hero types"""
    print("=" * 60)
    print("DEMONSTRATING POLYMORPHISM - SAME METHODS, DIFFERENT BEHAVIORS")
    print("=" * 60)
    
    # Create different types of heroes
    heroes = [
        Superhero("Peter Parker", 22, "Male", "Spider-Man", ["Web Slinging", "Spider Sense"], "Responsibility"),
        FlyingHero("Carol Danvers", 35, "Female", "Captain Marvel", ["Photon Blasts", "Super Strength"], max_altitude=100000),
        TechHero("Bruce Wayne", 40, "Male", "Batman", ["Martial Arts", "Detective Skills"], "No Powers", intelligence_level=90)
    ]
    
    print("All heroes introducing themselves (polymorphism in action):")
    for hero in heroes:
        print(f"- {hero.introduce()}")
    
    print("\nAll heroes fighting the same villain (different approaches):")
    for hero in heroes:
        print(f"\n{hero.get_hero_name()}'s approach:")
        hero.fight_villain("The Joker")
    
    print("\nAll heroes resting (different behaviors):")
    for hero in heroes:
        print(f"\n{hero.get_hero_name()}'s rest:")
        hero.rest()
    print()

def demonstrate_encapsulation():
    """Demonstrate encapsulation principles"""
    print("=" * 60)
    print("DEMONSTRATING ENCAPSULATION")
    print("=" * 60)
    
    hero = TechHero("Natasha Romanoff", 35, "Female", "Black Widow", 
                   ["Espionage", "Combat Skills"], intelligence_level=88)
    
    print("Accessing attributes through proper methods (encapsulation):")
    print(f"Name: {hero.get_name()}")
    print(f"Hero Name: {hero.get_hero_name()}")
    print(f"Intelligence: {hero.get_intelligence_level()}")
    print(f"Powers: {hero.get_powers()}")
    
    print("\nTrying to modify attributes through setters:")
    hero.set_name("Natasha Romanoff-Rogers")
    hero.set_hero_name("The Black Widow")
    hero.upgrade_intelligence(5)
    
    print(f"Updated Name: {hero.get_name()}")
    print(f"Updated Hero Name: {hero.get_hero_name()}")
    print(f"Updated Intelligence: {hero.get_intelligence_level()}")
    
    print("\nDemonstrating validation in setters:")
    hero.set_age(-10)  # Should fail
    hero.set_health(150)  # Should fail
    print()

def main():
    """Main function to run all demonstrations"""
    print("🦸‍♂️ SUPERHERO OOP DEMONSTRATION 🦸‍♀️")
    print("Showcasing Inheritance, Polymorphism, Encapsulation, and Constructors")
    print("=" * 80)
    
    try:
        # Demonstrate each concept
        demonstrate_basic_person()
        demonstrate_basic_superhero()
        demonstrate_flying_hero()
        demonstrate_tech_hero()
        demonstrate_polymorphism()
        demonstrate_encapsulation()
        
        print("=" * 80)
        print("🎉 OOP DEMONSTRATION COMPLETED SUCCESSFULLY! 🎉")
        print("All concepts demonstrated:")
        print("✅ Inheritance: Classes inheriting from parent classes")
        print("✅ Polymorphism: Same methods behaving differently")
        print("✅ Encapsulation: Private attributes with getters/setters")
        print("✅ Constructors: Unique object initialization")
        print("=" * 80)
        
    except Exception as e:
        print(f"❌ Error during demonstration: {e}")
        print("Check your class implementations!")

if __name__ == "__main__":
    main()
