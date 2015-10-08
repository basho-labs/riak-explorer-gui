import BaseHTTPServer
import os

class Handler(BaseHTTPServer.BaseHTTPRequestHandler):

    # set mappings - dict of dicts - ex: {'/' : {'GET' : test}}
    # meaning, path / with GET request will map to test handler
    mappings = {}

    def main_handler(self, method):
        # get request url (without url params) and remove trailing /
        request_url = self.path.split('?')[0]
        if request_url is not '/':
            request_url = request_url.rstrip('/')

        handler = None
        try:
            handler = self.mappings[request_url][method]
        except KeyError, e:
            # no mapping found for the request
            if self.path == "/":
                self.path = '/index.html'

            base_dir = os.path.normpath(os.path.abspath(os.path.curdir))
            fname = base_dir + "/" + "dist" + self.path

            if not os.path.isfile(fname):
                fname = base_dir + "/" + "dist/index.html"

            f = open(fname, 'rb')
            self.send_response(200)
            if self.path.endswith(".html"):
                self.send_header('Content-type',    'text/html')
            elif self.path.endswith(".css"):
                self.send_header('Content-type',    'text/css')
            elif self.path.endswith(".js"):
                self.send_header('Content-type',    'application/javascript')
            self.end_headers()
            self.wfile.write(f.read())
            f.close()
            return

        try:
            handler(self)
        except KeyError, e:
            # method not found
            self.send_response(501)
            self.end_headers()
            return

    def __getattr__(self, name):
        if name.startswith('do_'):
            method = name[3:].upper()
            return lambda: self.main_handler(method)
        else:
            raise AttributeError()
