from TikTokApi import TikTokApi
import sys

verifyFp = "verify_kluyei8y_wfM64tFP_RNLH_4LMw_AQXF_zYPBvDIcD2az"

api = TikTokApi.get_instance(use_test_endpoints=True)


def printMusicSearch(term, numOfResults):
    music = api.search_for_music(term, count=numOfResults)
    for item in music:
        print('Artist: ' + item['music']['authorName'], '   Title: ' + item['music']['title'])

printMusicSearch('lofi', 50)
# print('////////')
# print('////////')
# printMusicSearch('popular', 50)

sys.stdout.flush()