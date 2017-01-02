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
        "limit": 10,
        "starting_after": self.request.get('start', None)
      }
      data = stripe.Product.list(**params)
      self.response.write(data)
    except:
      self.response.write('')


class ViewProduct(webapp2.RequestHandler):

  def get(self, product):
    self.response.headers['Content-Type'] = 'application/json'
    try:
      data = stripe.Product.retrieve(product)
      if (data['skus']['has_more']):
        all_skus = []
        skus = stripe.SKU.list(active=True, limit=100, product=data['id'])
        all_skus.extend(skus['data'])
        has_more = skus['has_more']
        while has_more:
          skus = stripe.SKU.list(active=True, limit=100, product=data['id'], starting_after=all_skus[-1]['id'])
          all_skus.extend(skus['data'])
          has_more = skus['has_more']
          #has_more = (len(skus['data']) > 0)
        data['skus']['data'] = all_skus
      self.response.write(data)
    except:
      self.response.write('')


class ViewAccount(webapp2.RequestHandler):

  def get(self):
    self.response.headers['Content-Type'] = 'application/json'
    try:
      data = stripe.Account.retrieve()
      result = {
        'business_logo': data['business_logo'],
        'business_name': data['business_name'],
        'business_primary_color': data['business_primary_color'],
        'business_url': data['business_url'],
        'default_currency': data['default_currency'],
        'support_email': data['support_email'],
        'support_phone': data['support_phone'],
        'support_url': data['support_url']
      }
      self.response.write(json.dumps(result))
    except:
      self.response.write('')


class CreateOrder(webapp2.RequestHandler):

  def post(self):
    self.response.headers['Content-Type'] = 'application/json'
    try:
      params = json.loads(self.request.body)
      # params filtering/cleanup/validation required
      data = stripe.Order.create(**params)
      self.response.write(data)
    except:
      self.response.write('')


class UpdateOrder(webapp2.RequestHandler):

  def post(self):
    self.response.headers['Content-Type'] = 'application/json'
    try:
      params = json.loads(self.request.body)
      # params filtering/cleanup/validation required
      order = stripe.Order.retrieve(params.pop('id', None))
      for key, value in params.iteritems():
        order[key] = value
      data = order.save()
      self.response.write(data)
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


class CreateSKUs(webapp2.RequestHandler):

  def get(self):
    self.response.headers['Content-Type'] = 'application/json'
    try:
      data = []
      sku = {}
      sku['product'] = 'prod_80HnnViSIO0LWc'
      sku['price'] = 100
      sku['currency'] = 'usd'
      sku['inventory'] = {'type': 'finite', 'quantity': '1'}
      sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
      colors = ['Black', 'Beige', 'Pink', 'Orange', 'Silver', 'Purple', 'Gray', 'Burgundy']
      fabrics = ['Silk', 'Cotton', 'Polyester']
      attributes = {}
      for size in sizes:
        attributes['size'] = size
        for color in colors:
          attributes['color'] = color
          for fabric in fabrics:
            attributes['fabric'] = fabric
            sku['attributes'] = attributes
            data.append(stripe.SKU.create(**sku))
      self.response.write(data)
    except:
      self.response.write('')


APP = webapp2.WSGIApplication([webapp2.Route(r'/products', handler=ListProducts),
                              webapp2.Route(r'/product/<product:(.*)>', handler=ViewProduct),
                              webapp2.Route(r'/account', handler=ViewAccount),
                              webapp2.Route(r'/order/create', handler=CreateOrder),
                              webapp2.Route(r'/order/update', handler=UpdateOrder),
                              webapp2.Route(r'/order/pay', handler=PayOrder),
                              webapp2.Route(r'/order/<order:(.*)>', handler=ViewOrder)],
                              debug=True)