const Twitter = require('twitter')
const fs = require('fs')
const config = require('config')
client = new Twitter()


const getSearchTweets = async (search) => {
    const wantTweets = 2000
    const params = {...search, count: 200}
    try {
        const tweets = await getTweets('search/tweets', params, wantTweets)
        console.log(`Final count ${tweets.length}`)
        fs.writeFileSync(`./tweets/search/${search.q}.json`, JSON.stringify(tweets))
        console.log("The file was saved!"); 
    } catch (ex) {
        console.error(ex)
    }
}


const getUserTweets = async (user) => {
    const wantTweets = 1000
    const params = {screen_name: user, count: 200, tweet_mode: 'extended', include_rts: false}
    try {
        const tweets = await getTweets('statuses/user_timeline', params, wantTweets)
        console.log(`Final count ${tweets.length}`)
        fs.writeFileSync(`./tweets/user/${user}.json`, JSON.stringify(tweets))
        console.log("The file was saved!"); 
    } catch (ex) {
        console.error(ex)
    }
}

const getTweets = async(path, params, wantTweets) => {
    const allTweets = []
    while (true) {
        let tweets = await client.get(path, params)
        if ("statuses" in tweets) {
            tweets = tweets.statuses
        }
        tweets
            .map(tweet => {
                allTweets.push(tweet)
            })

        if (tweets.length > 1 && allTweets.length < wantTweets) {
            params.max_id = tweets[tweets.length - 1].id
        } else {
            break
        }
    }
    return(allTweets)
}

const users = ['noble_man']// 'benmstanley', 'hannnahbeach', 'c_m_hunt','dereknordgren', 'harry__peters', 'damturSpeaks',]
for (user of users) {
    getUserTweets(user)
}

// const searchTerms = ['VAR', 'sixnations','coronavirus']
// for (term of searchTerms) {
//     const search = {q: term, geocode: "51.5259776,-0.1152378,300mi", lang: "en"}
//     getSearchTweets(search)
// }
