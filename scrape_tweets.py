import snscrape.modules.twitter as sntwitter
import json
import re
import sys

searchInput = sys.argv[1]

query = "{0} lang:en since:2022-11-01 -is:retweet -is:reply".format(searchInput)
tweets = []
limit = 400

for tweet in sntwitter.TwitterSearchScraper(query).get_items():
    if len(tweets) == limit:
        break
    else:
        content = re.sub('\W+', ' ', tweet.content)
        tweets.append(content)

json_tweets = json.dumps(tweets)

print(json_tweets)