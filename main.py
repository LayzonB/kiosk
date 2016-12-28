import logging
import os
import webapp2
import json

import stripe
stripe.api_key = "sk_test_m4QQ4tXt50ceGcWl9MsiA21B"


class ListProducts(webapp2.RequestHandler):

  def get(self):
    self.response.headers['Content-Type'] = 'application/json'
    try:
      params = {
        "active": "true",
        "limit": self.request.get('limit', 10),
        "start": self.request.get('start', None)
      }
      data = stripe.Product.list(**params)
      self.response.write(data)
      # for some reason json.dumps is not working here
      #self.response.write(json.dumps(data))
    except:
      self.response.write('')


class ViewProduct(webapp2.RequestHandler):

  def get(self, product):
    self.response.headers['Content-Type'] = 'application/json'
    try:
      data = stripe.Product.retrieve(product)
      self.response.write(data)
      # for some reason json.dumps is not working here
      #self.response.write(json.dumps(data))
    except:
      self.response.write('')


class ViewAccount(webapp2.RequestHandler):

  def get(self):
    self.response.headers['Content-Type'] = 'application/json'
    try:
      data = stripe.Account.retrieve()
      self.response.write(json.dumps(data))
    except:
      self.response.write('')


class CreateOrder(webapp2.RequestHandler):

  def post(self):
    self.response.headers['Content-Type'] = 'application/json'
    try:
      params = json.loads(self.request.body)
      # params filtering/cleanup/validation required
      data = stripe.Order.create(**params)
      self.response.write(json.dumps(data))
    except:
      self.response.write('')


class PayOrder(webapp2.RequestHandler):

  def post(self):
    self.response.headers['Content-Type'] = 'application/json'
    try:
      params = json.loads(self.request.body)
      # params filtering/cleanup/validation required
      order = stripe.Order.retrieve(params.pop("order"))
      data = order.pay(**params)
      self.response.write(json.dumps(data))
    except:
      self.response.write('')


class ViewOrder(webapp2.RequestHandler):

  def get(self, order):
    self.response.headers['Content-Type'] = 'application/json'
    try:
      data = stripe.Order.retrieve(order)
      self.response.write(json.dumps(data))
    except:
      self.response.write('')


APP = webapp2.WSGIApplication([webapp2.Route(r'/products', handler=ListProducts),
                              webapp2.Route(r'/product/<product:(.*)>', handler=ViewProduct),
                              webapp2.Route(r'/account', handler=ViewAccount),
                              webapp2.Route(r'/order/create', handler=CreateOrder),
                              webapp2.Route(r'/order/pay', handler=PayOrder),
                              webapp2.Route(r'/order/<order:(.*)>', handler=ViewOrder)],
                              debug=True)