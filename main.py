import logging
import os
import webapp2
import json

import stripe
stripe.api_key = "sk_test_m4QQ4tXt50ceGcWl9MsiA21B"


class ListProducts(webapp2.RequestHandler):

  def get(self):
    self.response.headers['Content-Type'] = 'application/json'
    data = stripe.Product.list(limit=3)
    self.response.write(data)


class ViewProduct(webapp2.RequestHandler):

  def get(self, product):
    self.response.headers['Content-Type'] = 'application/json'
    try:
      data = stripe.Product.retrieve(product)
      self.response.write(data)
    except:
      self.response.write('')


class ViewOrder(webapp2.RequestHandler):

  def get(self, order):
    self.response.headers['Content-Type'] = 'application/json'
    try:
      data = stripe.Order.retrieve(order)
      self.response.write(data)
    except:
      self.response.write('')


class CreateOrder(webapp2.RequestHandler):

  def post(self):
    pass


class Pay(webapp2.RequestHandler):

  def post(self):
    pass


class ListProductsJ(webapp2.RequestHandler):

  def get(self):
    self.response.headers['Content-Type'] = 'application/json'
    data = stripe.Product.list(limit=3)
    self.response.write(json.dumps(data))


APP = webapp2.WSGIApplication([webapp2.Route(r'/products', handler=ListProducts),
                              webapp2.Route(r'/product/<product:(.*)>', handler=ViewProduct),
                              webapp2.Route(r'/order/<order:(.*)>', handler=ViewOrder),
                              webapp2.Route(r'/j', handler=ListProductsJ)],
                              debug=True)