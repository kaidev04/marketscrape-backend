const Sentiment = require('sentiment');
var sentiment = new Sentiment();

const getSentiment = function(searchInput, _callback) {
    var sentimentScores = [];
    var average = 0;
    positive = 0;
    negative = 0;
    neutral = 0;

    const spawner = require('child_process').spawn;
    const python_process = spawner('python', ['./scrape_tweets.py', searchInput]);

    python_process.stdout.on('data', function(data) {
        try {
            var tweets = JSON.parse(data);
            tweets.forEach(tweet => {
                let result = sentiment.analyze(tweet);
                let afinnWordsLength = result.words.length;
                let score;
                if(afinnWordsLength > 0) {
                    score = result.score / afinnWordsLength;
                }
                else {
                    score = result.score;
                }
                sentimentScores.push(score);

                if(score < 0) {
                    negative++;
                }
                else if(0 <= score && score < 1.5) {
                    neutral++;
                }
                else if(score > 1.5) {
                    positive++;
                }
            });
        
            average = sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length;

            var sentimentLabel;
            if(average < 0) {
                sentimentLabel = "Negative";
            }
            else if(0 <= average && average <= 1.5) {
                sentimentLabel = "Neutral";
            }
            else if(average > 1.5) {
                sentimentLabel = "Positive";
            }

            var result = {
                'score': average,
                'positive': positive,
                'negative': negative,
                'neutral': neutral,
                'length': tweets.length,
                'sentiment': sentimentLabel
            }

            return _callback(result);
        }
        catch (e) {
            console.log(e);
        }
    })
}

module.exports.getSentiment = getSentiment;
