import discord
import sys
import os

class MyClient(discord.Client):
    async def on_ready(self):
        print('Logged on as {0}!'.format(self.user))

    async def on_message(self, message):
        if message.content.startswith('$hello'):
            await message.channel.send('Hello!')

def main(args):
    print('hello', args)
    client = MyClient()
    client.run(os.environ['TOKEN'])

if __name__ == '__main__':
    main(sys.argv)