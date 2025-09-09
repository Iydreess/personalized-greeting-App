#!/usr/bin/env python3
"""
File Read & Write Challenge with Error Handling
This program demonstrates:
1. Reading a file and writing a modified version to a new file
2. Proper error handling for file operations
"""

import os
from pathlib import Path

def create_sample_file():
    """Create a sample file for testing if it doesn't exist"""
    sample_filename = "sample_text.txt"
    sample_content = """Hello World!
This is a sample file for testing.
Python file handling is fun!
Let's learn about error handling too.
This content will be modified and saved to a new file."""
    
    if not os.path.exists(sample_filename):
        try:
            with open(sample_filename, 'w', encoding='utf-8') as file:
                file.write(sample_content)
            print(f"✅ Created sample file: {sample_filename}")
        except IOError as e:
            print(f"❌ Error creating sample file: {e}")

def modify_content(content):
    """
    Modify the file content - you can customize this function
    Current modifications:
    1. Convert to uppercase
    2. Add line numbers
    3. Add a header
    """
    lines = content.split('\n')
    modified_lines = ["=== MODIFIED FILE CONTENT ===", ""]
    
    for i, line in enumerate(lines, 1):
        if line.strip():  # Only add line numbers to non-empty lines
            modified_lines.append(f"{i:2d}. {line.upper()}")
        else:
            modified_lines.append("")
    
    modified_lines.extend(["", "=== END OF MODIFIED CONTENT ==="])
    return '\n'.join(modified_lines)

def read_and_write_file():
    """Main function that handles file reading, modifying, and writing"""
    
    # Create sample file for testing
    create_sample_file()
    print()
    
    while True:
        try:
            # Get filename from user
            filename = input("📁 Enter the filename to read (or 'quit' to exit): ").strip()
            
            if filename.lower() == 'quit':
                print("👋 Goodbye!")
                break
            
            if not filename:
                print("⚠️ Please enter a valid filename.")
                continue
            
            # Attempt to read the file
            print(f"📖 Attempting to read file: {filename}")
            
            with open(filename, 'r', encoding='utf-8') as input_file:
                original_content = input_file.read()
            
            print(f"✅ Successfully read {len(original_content)} characters from {filename}")
            
            # Modify the content
            modified_content = modify_content(original_content)
            
            # Create output filename
            input_path = Path(filename)
            output_filename = f"modified_{input_path.stem}{input_path.suffix}"
            
            # Write modified content to new file
            with open(output_filename, 'w', encoding='utf-8') as output_file:
                output_file.write(modified_content)
            
            print(f"✅ Successfully wrote modified content to: {output_filename}")
            
            # Show preview of changes
            print("\n" + "="*50)
            print("📋 PREVIEW OF MODIFICATIONS:")
            print("="*50)
            print(modified_content[:200] + "..." if len(modified_content) > 200 else modified_content)
            print("="*50)
            
            # Ask if user wants to continue with another file
            another = input("\n🔄 Would you like to process another file? (y/n): ").strip().lower()
            if another not in ['y', 'yes']:
                print("👋 Thank you for using the File Handler!")
                break
                
        except FileNotFoundError:
            print(f"❌ Error: The file '{filename}' was not found.")
            print("💡 Make sure the file exists in the current directory.")
            print(f"📍 Current directory: {os.getcwd()}")
            
        except PermissionError:
            print(f"❌ Error: Permission denied when trying to access '{filename}'.")
            print("💡 Make sure you have read permissions for this file.")
            
        except IsADirectoryError:
            print(f"❌ Error: '{filename}' is a directory, not a file.")
            print("💡 Please specify a file name, not a directory.")
            
        except UnicodeDecodeError:
            print(f"❌ Error: Cannot decode '{filename}'. It might be a binary file.")
            print("💡 This program works with text files only.")
            
        except IOError as e:
            print(f"❌ IO Error occurred: {e}")
            print("💡 There was a problem reading or writing the file.")
            
        except Exception as e:
            print(f"❌ Unexpected error occurred: {e}")
            print("💡 Please try again or contact support.")
        
        print()  # Add blank line for readability

def display_menu():
    """Display program information and menu"""
    print("🐍 PYTHON FILE HANDLING & ERROR HANDLING CHALLENGE")
    print("="*55)
    print("This program will:")
    print("• Ask you for a filename")
    print("• Read the file content")
    print("• Modify the content (uppercase + line numbers)")
    print("• Write the modified content to a new file")
    print("• Handle various file-related errors gracefully")
    print("="*55)
    print()

def main():
    """Main program entry point"""
    display_menu()
    read_and_write_file()

if __name__ == "__main__":
    main()
