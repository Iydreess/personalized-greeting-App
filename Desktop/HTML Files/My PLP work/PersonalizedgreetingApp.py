import json
from datetime import datetime
from collections import defaultdict
import sys

try:
    from termcolor import colored
except ImportError:
    print("Note: For colored output, install termcolor: pip install termcolor")

class GreetingApp:
    def __init__(self):
        self.user_data = defaultdict(dict)
        self.load_data()
        
    def load_data(self):
        try:
            with open('user_data.json', 'r') as f:
                self.user_data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            self.user_data = defaultdict(dict)
    
    def save_data(self):
        with open('user_data.json', 'w') as f:
            json.dump(self.user_data, f, indent=2)
    
    def get_user_info(self):
        print("\n" + "="*40)
        print("🌟 Personalized Greeting App 🌟")
        print("="*40 + "\n")
        
        name = input("What's your name? ").strip().title()
        
        # Check if we know this user
        if name in self.user_data:
            print(f"\nWelcome back, {name}!")
            use_saved = input("Would you like to use your saved preferences? (y/n): ").lower()
            if use_saved == 'y':
                return name, self.user_data[name]
        
        # Get new information
        color = input("What's your favorite color? ").strip().lower()
        hobby = input("What's your favorite hobby? ").strip().title()
        age = input("How old are you? (optional, press enter to skip) ").strip()
        
        # Store the data
        self.user_data[name] = {
            'color': color,
            'hobby': hobby,
            'age': age if age.isdigit() else None,
            'last_visited': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        self.save_data()
        
        return name, self.user_data[name]
    
    def generate_greeting(self, name, data):
        hour = datetime.now().hour
        if 5 <= hour < 12:
            time_greeting = "Good morning"
        elif 12 <= hour < 17:
            time_greeting = "Good afternoon"
        elif 17 <= hour < 21:
            time_greeting = "Good evening"
        else:
            time_greeting = "Good night"
        
        # Basic greeting
        greeting = f"\n{time_greeting}, {name}!"
        
        # Colorful part
        try:
            color_display = colored(data['color'], data['color'])
        except:
            color_display = data['color']
        
        greeting += f" Your favorite color, {color_display}, is fantastic!"
        
        # Hobby mention
        greeting += f" I see you enjoy {data['hobby']} - that's awesome!"
        
        # Age-specific message if available
        if data['age']:
            age = int(data['age'])
            if age < 13:
                greeting += " Wow, you're quite young!"
            elif 13 <= age < 20:
                greeting += " Awesome teenage years!"
            elif 20 <= age < 30:
                greeting += " The roaring 20s - great time!"
            else:
                greeting += " Age is just a number!"
        
        # Last visited (for returning users)
        if 'last_visited' in data:
            last_time = datetime.strptime(data['last_visited'], "%Y-%m-%d %H:%M:%S")
            days_since = (datetime.now() - last_time).days
            if days_since > 0:
                greeting += f"\n\nWe haven't seen you in {days_since} day{'s' if days_since > 1 else ''}!"
        
        return greeting
    
    def run(self):
        while True:
            name, data = self.get_user_info()
            greeting = self.generate_greeting(name, data)
            
            print("\n" + "="*40)
            print(greeting)
            print("="*40 + "\n")
            
            choice = input("Would you like to create another greeting? (y/n): ").lower()
            if choice != 'y':
                print("\nThank you for using the Personalized Greeting App! Goodbye!\n")
                break

if __name__ == "__main__":
    app = GreetingApp()
    app.run()