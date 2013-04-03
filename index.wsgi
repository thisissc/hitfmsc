#!/usr/bin/env python
# -*- coding: utf-8 -*-

import tornado.web
import tornado.wsgi
import tornado.options

import sae

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("<h1><a href='http://weibo.com/thisissc'>@thisissc</a></h1>")

app = tornado.wsgi.WSGIApplication([
    (r'/', MainHandler),
])

application = sae.create_wsgi_app(app)

