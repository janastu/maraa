import urllib2

def application(environ, start_response):
    status = '200 OK'
    try:
        page = urllib2.urlopen("http://newsrack.in/rss/rohitkumar/Radiohello/Media-Feeds/rss.xml")
        data = page.read()
        page.close()
    except:
        status = "500"
        data = "Something went wrong while fetching the feeds."
    response_headers = [('Content-type', 'text/xml'),
                        ('Content-Length', str(len(data)))]
    start_response(status, response_headers)
    return [data]