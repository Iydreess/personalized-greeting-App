import json
from datetime import datetime, date
from collections import defaultdict
import sys
import random
import os

try:
    from termcolor import colored
    COLORS_AVAILABLE = True
except ImportError:
    print("Note: For colored output, install termcolor: pip install termcolor")
    COLORS_AVAILABLE = False

try:
    import requests
    WEATHER_AVAILABLE = True
except ImportError:
    print("Note: For weather features, install requests: pip install requests")
    WEATHER_AVAILABLE = False

class GreetingApp:
    def __init__(self):
        self.user_data = defaultdict(dict)
        self.load_data()
        self.motivational_quotes = [
            "The only way to do great work is to love what you do. - Steve Jobs",
            "Life is what happens to you while you're busy making other plans. - John Lennon",
            "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
            "It is during our darkest moments that we must focus to see the light. - Aristotle",
            "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
            "The only impossible journey is the one you never begin. - Tony Robbins",
            "In the middle of difficulty lies opportunity. - Albert Einstein",
            "Believe you can and you're halfway there. - Theodore Roosevelt",
            "It does not matter how slowly you go as long as you do not stop. - Confucius",
            "Everything you've ever wanted is on the other side of fear. - George Addair"
        ]
        
        self.mood_emojis = {
            "happy": "😊",
            "sad": "😢", 
            "excited": "🎉",
            "tired": "😴",
            "motivated": "💪",
            "relaxed": "😌",
            "stressed": "😰",
            "grateful": "🙏",
            "energetic": "⚡",
            "peaceful": "🕊️"
        }
        
        self.greeting_styles = {
            "casual": ["Hey there", "Hi", "Hello", "What's up"],
            "formal": ["Good day", "Greetings", "Salutations", "Welcome"],
            "enthusiastic": ["Awesome to see you", "Fantastic", "Amazing", "Wonderful"],
            "friendly": ["Great to meet you", "Nice to see you", "Happy to see you", "Glad you're here"]
        }
        
    def load_data(self):
        try:
            with open('user_data.json', 'r') as f:
                loaded_data = json.load(f)
                # Convert to defaultdict for easier access
                self.user_data = defaultdict(dict)
                for key, value in loaded_data.items():
                    self.user_data[key] = value
        except (FileNotFoundError, json.JSONDecodeError):
            self.user_data = defaultdict(dict)
    
    def save_data(self):
        # Convert defaultdict to regular dict for JSON serialization
        regular_dict = dict(self.user_data)
        with open('user_data.json', 'w') as f:
            json.dump(regular_dict, f, indent=2)
    
    def clear_screen(self):
        os.system('cls' if os.name == 'nt' else 'clear')
    
    def print_colored(self, text, color='white', style=None):
        if COLORS_AVAILABLE:
            attrs = []
            if style == 'bold':
                attrs.append('bold')
            elif style == 'underline':
                attrs.append('underline')
            print(colored(text, color, attrs=attrs))
        else:
            print(text)
    
    def print_banner(self):
        banner = """
    ╔══════════════════════════════════════════════════════╗
    ║          🌟 ENHANCED PERSONALIZED GREETING APP 🌟     ║
    ║                  Welcome to Your Space!              ║
    ╚══════════════════════════════════════════════════════╝
        """
        self.print_colored(banner, 'cyan', 'bold')
    
    def get_weather_greeting(self, location="London"):
        if not WEATHER_AVAILABLE:
            return None
            
        try:
            # Using a free weather API (OpenWeatherMap requires API key)
            # For demo purposes, we'll simulate weather
            weather_conditions = ["sunny", "cloudy", "rainy", "snowy", "windy"]
            weather = random.choice(weather_conditions)
            
            weather_greetings = {
                "sunny": "What a beautiful sunny day! ☀️",
                "cloudy": "It's a bit cloudy, but still a great day! ☁️",
                "rainy": "It's raining outside, perfect for a cozy day! 🌧️",
                "snowy": "Snow is falling, stay warm! ❄️",
                "windy": "It's windy out there, hold onto your hat! 💨"
            }
            
            return weather_greetings.get(weather, "Hope you're having a great day! 🌈")
        except:
            return None
    
    def get_user_info(self):
        self.clear_screen()
        self.print_banner()
        
        name = input("👤 What's your name? ").strip().title()
        
        # Check if we know this user
        if name in self.user_data:
            self.print_colored(f"\n🎉 Welcome back, {name}!", 'green', 'bold')
            user_data = self.user_data[name]
            
            # Show some stats
            visits = user_data.get('visit_count', 1)
            last_visit = user_data.get('last_visited', 'Never')
            
            print(f"📊 Visit #{visits} | Last seen: {last_visit}")
            
            use_saved = input("\n💾 Would you like to use your saved preferences? (y/n): ").lower()
            if use_saved == 'y':
                # Update visit count and last visited
                self.user_data[name]['visit_count'] = visits + 1
                self.user_data[name]['last_visited'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                self.save_data()
                return name, self.user_data[name]
        
        # Get new information with enhanced options
        print(f"\n🆕 Let's get to know you better, {name}!")
        
        # Basic info
        color = input("🎨 What's your favorite color? ").strip().lower()
        hobby = input("🏃 What's your favorite hobby? ").strip().title()
        age = input("🎂 How old are you? (optional, press enter to skip): ").strip()
        
        # New enhanced fields
        print("\n📅 Let's add your birthday for special greetings!")
        birth_month = input("Birth month (1-12, optional): ").strip()
        birth_day = input("Birth day (1-31, optional): ").strip()
        
        print("\n🎭 How are you feeling today?")
        mood_options = list(self.mood_emojis.keys())
        for i, mood in enumerate(mood_options, 1):
            print(f"{i}. {mood.title()} {self.mood_emojis[mood]}")
        
        try:
            mood_choice = int(input("Choose your mood (1-10): ")) - 1
            current_mood = mood_options[mood_choice] if 0 <= mood_choice < len(mood_options) else "happy"
        except (ValueError, IndexError):
            current_mood = "happy"
        
        print("\n🗣️ What greeting style do you prefer?")
        style_options = list(self.greeting_styles.keys())
        for i, style in enumerate(style_options, 1):
            print(f"{i}. {style.title()}")
        
        try:
            style_choice = int(input("Choose your style (1-4): ")) - 1
            greeting_style = style_options[style_choice] if 0 <= style_choice < len(style_options) else "casual"
        except (ValueError, IndexError):
            greeting_style = "casual"
        
        # Store the enhanced data
        self.user_data[name] = {
            'color': color,
            'hobby': hobby,
            'age': age if age.isdigit() else None,
            'birth_month': birth_month if birth_month.isdigit() and 1 <= int(birth_month) <= 12 else None,
            'birth_day': birth_day if birth_day.isdigit() and 1 <= int(birth_day) <= 31 else None,
            'current_mood': current_mood,
            'greeting_style': greeting_style,
            'visit_count': 1,
            'last_visited': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'total_moods': [current_mood],
            'creation_date': datetime.now().strftime("%Y-%m-%d")
        }
        self.save_data()
        
        return name, self.user_data[name]
    
    def check_birthday(self, data):
        if data.get('birth_month') and data.get('birth_day'):
            today = date.today()
            birth_month = int(data['birth_month'])
            birth_day = int(data['birth_day'])
            
            if today.month == birth_month and today.day == birth_day:
                return True
        return False
    
    def get_age_group_message(self, age):
        if age < 13:
            return "You're young and full of potential! 🌟"
        elif 13 <= age < 20:
            return "Teenage years are amazing for growth and discovery! 🚀"
        elif 20 <= age < 30:
            return "Your twenties are perfect for adventures and dreams! ✨"
        elif 30 <= age < 50:
            return "You're in your prime years - make them count! 💼"
        elif 50 <= age < 70:
            return "Wisdom and experience are your superpowers! 🎓"
        else:
            return "Age is just a number - you're timeless! 👑"
    
    def get_mood_message(self, mood):
        mood_messages = {
            "happy": "Your happiness is contagious! Keep spreading those good vibes! 😊",
            "sad": "It's okay to feel sad sometimes. Tomorrow is a new day! 🌅",
            "excited": "Your excitement is electrifying! Channel that energy! ⚡",
            "tired": "Rest is important. Take care of yourself! 😴",
            "motivated": "That motivation will take you places! Keep pushing! 💪",
            "relaxed": "Being relaxed is a superpower in our busy world! 😌",
            "stressed": "Take a deep breath. You've got this! 🧘‍♀️",
            "grateful": "Gratitude is the key to happiness! 🙏",
            "energetic": "Your energy is amazing! Use it wisely! ⚡",
            "peaceful": "Inner peace is a treasure. Hold onto it! 🕊️"
        }
        return mood_messages.get(mood, "Every feeling is valid and temporary! 💝")
    
    def generate_enhanced_greeting(self, name, data):
        # Clear screen for dramatic effect
        self.clear_screen()
        
        # Time-based greeting
        hour = datetime.now().hour
        if 5 <= hour < 12:
            time_greeting = "Good morning"
            time_emoji = "🌅"
        elif 12 <= hour < 17:
            time_greeting = "Good afternoon"
            time_emoji = "☀️"
        elif 17 <= hour < 21:
            time_greeting = "Good evening"
            time_emoji = "🌆"
        else:
            time_greeting = "Good night"
            time_emoji = "🌙"
        
        # Get greeting style
        style = data.get('greeting_style', 'casual')
        style_greeting = random.choice(self.greeting_styles[style])
        
        # Start building the greeting
        greeting_parts = []
        
        # Header with time and style
        greeting_parts.append("="*60)
        greeting_parts.append(f"{time_emoji} {time_greeting}, {name}! {style_greeting}! {time_emoji}")
        greeting_parts.append("="*60)
        
        # Birthday check
        if self.check_birthday(data):
            greeting_parts.append("🎉🎂 HAPPY BIRTHDAY! 🎂🎉")
            greeting_parts.append("Hope your special day is absolutely wonderful!")
            greeting_parts.append("")
        
        # Color and hobby section
        color = data.get('color', 'unknown')
        hobby = data.get('hobby', 'unknown')
        
        if COLORS_AVAILABLE and color in ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']:
            color_display = colored(color.upper(), color, attrs=['bold'])
        else:
            color_display = color.upper()
        
        greeting_parts.append(f"🎨 Your favorite color {color_display} represents your vibrant personality!")
        greeting_parts.append(f"🏃 {hobby} is such a fantastic hobby! Keep pursuing your passions!")
        
        # Age-specific message
        if data.get('age'):
            age = int(data['age'])
            age_message = self.get_age_group_message(age)
            greeting_parts.append(f"🎂 At {age}, {age_message}")
        
        # Mood section
        current_mood = data.get('current_mood', 'happy')
        mood_emoji = self.mood_emojis.get(current_mood, '😊')
        mood_message = self.get_mood_message(current_mood)
        
        greeting_parts.append("")
        greeting_parts.append(f"🎭 Current mood: {current_mood.title()} {mood_emoji}")
        greeting_parts.append(f"   {mood_message}")
        
        # Weather greeting
        weather_msg = self.get_weather_greeting()
        if weather_msg:
            greeting_parts.append("")
            greeting_parts.append(f"🌤️ {weather_msg}")
        
        # Visit statistics
        visit_count = data.get('visit_count', 1)
        if visit_count > 1:
            greeting_parts.append("")
            greeting_parts.append(f"📊 This is visit #{visit_count}! Thanks for coming back!")
            
            # Show mood history if available
            total_moods = data.get('total_moods', [])
            if len(total_moods) > 1:
                most_common_mood = max(set(total_moods), key=total_moods.count)
                greeting_parts.append(f"💭 Your most common mood has been: {most_common_mood} {self.mood_emojis.get(most_common_mood, '😊')}")
        
        # Motivational quote
        quote = random.choice(self.motivational_quotes)
        greeting_parts.append("")
        greeting_parts.append("💫 Today's inspiration:")
        greeting_parts.append(f"   \"{quote}\"")
        
        # Last visited info for returning users
        if visit_count > 1:
            last_time = datetime.strptime(data['last_visited'], "%Y-%m-%d %H:%M:%S")
            days_since = (datetime.now() - last_time).days
            if days_since > 0:
                greeting_parts.append("")
                greeting_parts.append(f"⏰ We last saw you {days_since} day{'s' if days_since > 1 else ''} ago!")
        
        greeting_parts.append("")
        greeting_parts.append("✨ Have an absolutely amazing day! ✨")
        greeting_parts.append("="*60)
        
        return "\n".join(greeting_parts)
    
    def show_user_dashboard(self, name, data):
        self.clear_screen()
        self.print_colored(f"\n📊 {name}'s Personal Dashboard 📊", 'cyan', 'bold')
        print("="*50)
        
        # Basic info
        print(f"👤 Name: {name}")
        print(f"🎨 Favorite Color: {data.get('color', 'Not set').title()}")
        print(f"🏃 Hobby: {data.get('hobby', 'Not set')}")
        
        if data.get('age'):
            print(f"🎂 Age: {data['age']}")
        
        if data.get('birth_month') and data.get('birth_day'):
            print(f"📅 Birthday: {data['birth_month']}/{data['birth_day']}")
        
        # Visit statistics
        print(f"\n📈 Statistics:")
        print(f"   🔢 Total visits: {data.get('visit_count', 1)}")
        print(f"   📅 Member since: {data.get('creation_date', 'Unknown')}")
        print(f"   🕐 Last visit: {data.get('last_visited', 'Now')}")
        
        # Mood history
        total_moods = data.get('total_moods', [])
        if total_moods:
            print(f"\n🎭 Mood History:")
            mood_counts = {}
            for mood in total_moods:
                mood_counts[mood] = mood_counts.get(mood, 0) + 1
            
            for mood, count in sorted(mood_counts.items(), key=lambda x: x[1], reverse=True):
                emoji = self.mood_emojis.get(mood, '😊')
                print(f"   {emoji} {mood.title()}: {count} time{'s' if count > 1 else ''}")
        
        print("\n" + "="*50)
        input("\n📱 Press Enter to continue...")
    
    def update_mood(self, name):
        self.clear_screen()
        self.print_colored("🎭 Mood Update", 'yellow', 'bold')
        print("How are you feeling right now?")
        
        mood_options = list(self.mood_emojis.keys())
        for i, mood in enumerate(mood_options, 1):
            print(f"{i}. {mood.title()} {self.mood_emojis[mood]}")
        
        try:
            mood_choice = int(input("\nChoose your current mood (1-10): ")) - 1
            if 0 <= mood_choice < len(mood_options):
                new_mood = mood_options[mood_choice]
                
                # Update user data
                self.user_data[name]['current_mood'] = new_mood
                
                # Add to mood history
                if 'total_moods' not in self.user_data[name]:
                    self.user_data[name]['total_moods'] = []
                self.user_data[name]['total_moods'].append(new_mood)
                
                self.save_data()
                
                mood_message = self.get_mood_message(new_mood)
                self.print_colored(f"\n✅ Mood updated to: {new_mood} {self.mood_emojis[new_mood]}", 'green')
                print(f"💭 {mood_message}")
            else:
                print("❌ Invalid choice!")
        except ValueError:
            print("❌ Please enter a valid number!")
        
        input("\n📱 Press Enter to continue...")
    
    def show_main_menu(self, name):
        while True:
            self.clear_screen()
            self.print_colored(f"🏠 Main Menu - Welcome {name}!", 'cyan', 'bold')
            print("="*40)
            print("1. 🎉 Generate New Greeting")
            print("2. 📊 View Dashboard") 
            print("3. 🎭 Update Mood")
            print("4. ⚙️  Update Profile")
            print("5. 🚪 Exit")
            print("="*40)
            
            choice = input("Choose an option (1-5): ").strip()
            
            if choice == '1':
                return 'greeting'
            elif choice == '2':
                self.show_user_dashboard(name, self.user_data[name])
            elif choice == '3':
                self.update_mood(name)
            elif choice == '4':
                return 'update'
            elif choice == '5':
                return 'exit'
            else:
                print("❌ Invalid choice! Please try again.")
                input("Press Enter to continue...")
    
    def generate_greeting(self, name, data):
        # This method is kept for compatibility but now calls the enhanced version
        return self.generate_enhanced_greeting(name, data)
    
    def run(self):
        while True:
            try:
                name, data = self.get_user_info()
                
                while True:
                    action = self.show_main_menu(name)
                    
                    if action == 'greeting':
                        greeting = self.generate_enhanced_greeting(name, data)
                        self.clear_screen()
                        self.print_colored(greeting, 'white')
                        input("\n🎯 Press Enter to return to menu...")
                        
                    elif action == 'update':
                        # Allow user to update their profile
                        print("\n⚙️ Update your profile:")
                        update_choice = input("What would you like to update? (color/hobby/age/birthday/style): ").lower()
                        
                        if update_choice == 'color':
                            new_color = input("New favorite color: ").strip().lower()
                            self.user_data[name]['color'] = new_color
                            print(f"✅ Color updated to {new_color}!")
                            
                        elif update_choice == 'hobby':
                            new_hobby = input("New favorite hobby: ").strip().title()
                            self.user_data[name]['hobby'] = new_hobby
                            print(f"✅ Hobby updated to {new_hobby}!")
                            
                        elif update_choice == 'age':
                            new_age = input("New age: ").strip()
                            if new_age.isdigit():
                                self.user_data[name]['age'] = new_age
                                print(f"✅ Age updated to {new_age}!")
                            else:
                                print("❌ Please enter a valid age!")
                                
                        elif update_choice == 'birthday':
                            month = input("Birth month (1-12): ").strip()
                            day = input("Birth day (1-31): ").strip()
                            if (month.isdigit() and 1 <= int(month) <= 12 and 
                                day.isdigit() and 1 <= int(day) <= 31):
                                self.user_data[name]['birth_month'] = month
                                self.user_data[name]['birth_day'] = day
                                print(f"✅ Birthday updated to {month}/{day}!")
                            else:
                                print("❌ Please enter valid month and day!")
                                
                        elif update_choice == 'style':
                            print("Greeting styles:")
                            style_options = list(self.greeting_styles.keys())
                            for i, style in enumerate(style_options, 1):
                                print(f"{i}. {style.title()}")
                            
                            try:
                                style_choice = int(input("Choose new style (1-4): ")) - 1
                                if 0 <= style_choice < len(style_options):
                                    new_style = style_options[style_choice]
                                    self.user_data[name]['greeting_style'] = new_style
                                    print(f"✅ Greeting style updated to {new_style}!")
                                else:
                                    print("❌ Invalid choice!")
                            except ValueError:
                                print("❌ Please enter a valid number!")
                        else:
                            print("❌ Invalid update option!")
                        
                        self.save_data()
                        input("\n📱 Press Enter to continue...")
                        
                        # Refresh data
                        data = self.user_data[name]
                        
                    elif action == 'exit':
                        break
                
                # Ask if they want to create greeting for another user
                self.clear_screen()
                self.print_colored("👋 Thank you for using the Enhanced Greeting App!", 'green', 'bold')
                
                another = input("\n🤔 Would you like to create a greeting for another user? (y/n): ").lower()
                if another != 'y':
                    self.print_colored("\n🌟 Have an amazing day! See you next time! 🌟", 'cyan', 'bold')
                    break
                    
            except KeyboardInterrupt:
                self.print_colored("\n\n👋 Thanks for using the app! Goodbye!", 'yellow')
                break
            except Exception as e:
                self.print_colored(f"\n❌ An error occurred: {str(e)}", 'red')
                print("Don't worry, your data is safe! Try again.")
                input("Press Enter to continue...")

if __name__ == "__main__":
    app = GreetingApp()
    app.run()