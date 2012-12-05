from flask import Flask
from flask import request
import urllib2

app = Flask(__name__)

@app.route('/',methods=['GET'])
def index():
    url = request.args['rss_url']
    try:
        page = urllib2.urlopen(url)
        data = page.read()
        page.close()
    except:
        status = "500"
        data = "Something went wrong while fetching the feeds."
    return data

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
