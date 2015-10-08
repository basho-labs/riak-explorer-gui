import sys
import os
import BaseHTTPServer

def run(context_path='', port=8000):

    # set current working dir on python path
    base_dir = os.path.normpath(os.path.abspath(os.path.curdir))
    sys.path.insert(0, base_dir)

    import mockserver.handler
    import mockserver.config

    mockserver.handler.Handler.mappings = mockserver.config.mappings

    server = BaseHTTPServer.HTTPServer((context_path, port), mockserver.handler.Handler)
    server.serve_forever()

if __name__ == '__main__':
    run()
