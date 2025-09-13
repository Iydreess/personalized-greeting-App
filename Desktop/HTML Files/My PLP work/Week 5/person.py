"""
Base Person class demonstrating basic OOP concepts
- Encapsulation: Private attributes with getters/setters
- Constructor: Initialize objects with unique values
"""

class Person:
    def __init__(self, name, age, gender):
        """Constructor to initialize each Person object with unique values"""
        self.__name = name  # Private attribute (encapsulation)
        self.__age = age    # Private attribute
        self.__gender = gender  # Private attribute
        self._health = 100  # Protected attribute
    
    # Getter methods (encapsulation)
    def get_name(self):
        """Get the person's name"""
        return self.__name
    
    def get_age(self):
        """Get the person's age"""
        return self.__age
    
    def get_gender(self):
        """Get the person's gender"""
        return self.__gender
    
    def get_health(self):
        """Get the person's health"""
        return self._health
    
    # Setter methods (encapsulation)
    def set_name(self, name):
        """Set the person's name"""
        if isinstance(name, str) and len(name) > 0:
            self.__name = name
        else:
            print("Invalid name!")
    
    def set_age(self, age):
        """Set the person's age"""
        if isinstance(age, int) and age > 0:
            self.__age = age
        else:
            print("Invalid age!")
    
    def set_health(self, health):
        """Set the person's health"""
        if 0 <= health <= 100:
            self._health = health
        else:
            print("Health must be between 0 and 100!")
    
    # Methods
    def introduce(self):
        """Introduce the person"""
        return f"Hi, I'm {self.__name}, {self.__age} years old."
    
    def celebrate_birthday(self):
        """Increase age by 1"""
        self.__age += 1
        print(f"Happy birthday! {self.__name} is now {self.__age} years old.")
    
    def take_damage(self, damage):
        """Reduce health by damage amount"""
        self._health = max(0, self._health - damage)
        print(f"{self.__name} took {damage} damage. Health: {self._health}")
    
    def heal(self, amount):
        """Increase health by heal amount"""
        self._health = min(100, self._health + amount)
        print(f"{self.__name} healed for {amount}. Health: {self._health}")
    
    def __str__(self):
        """String representation of the person"""
        return f"Person(name={self.__name}, age={self.__age}, health={self._health})"
    
    def __repr__(self):
        """Developer-friendly representation"""
        return f"Person('{self.__name}', {self.__age}, '{self.__gender}')"
