import discord
import os
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv("TOKEN")
CLIENT = discord.Client(intents=discord.Intents.all())

@CLIENT.event
async def on_ready():
    print(f'{CLIENT.user} is now running!')

def run_bot():
    CLIENT.run(TOKEN)

def main():
    run_bot()

if __name__ == '__main__':
    main()