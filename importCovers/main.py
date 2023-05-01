import requests, json

games = open("games.json")

def getGameIdFromName(name):
    print(json.load(games))
    
    return requests.get(url).text

print(getGameIdFromName("Beatsaber"))