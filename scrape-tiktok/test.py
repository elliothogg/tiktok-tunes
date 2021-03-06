from TikTokApi import TikTokApi
import sys
import json

verifyFp = "verify_kluyei8y_wfM64tFP_RNLH_4LMw_AQXF_zYPBvDIcD2az"

api = TikTokApi.get_instance(use_test_endpoints=True)

genre = sys.argv[1]
count = int(sys.argv[2])

def printMusicSearch(term, numOfResults):
    music = api.search_for_music(term, count=numOfResults)
    artists, titles = [], []
    for item in music:
        result = {}
        artists.append((item['music']['authorName']).replace(" ", "-"))
        titles.append((item['music']['title']).replace(" ", "-"))
    return json.dumps([{"Artist": a, "Title": t} for a, t in zip(artists, titles)])


print(printMusicSearch(genre, count))


sys.stdout.flush()