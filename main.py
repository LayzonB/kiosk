import logging
import os
import webapp2
import json

import stripe
stripe.api_key = "sk_test_m4QQ4tXt50ceGcWl9MsiA21B"


class ListProducts(webapp2.RequestHandler):

	def get(self):
		products = stripe.Product.list(limit=3)
		self.response.write(products)


class ViewProduct(webapp2.RequestHandler):

	def get(self):
		pid = self.request.get('pid', None)
		if pid is not None:
			product = stripe.Product.retrieve(pid)
			self.response.write(product)


class Order(webapp2.RequestHandler):

	def post(self):
		order = self.request.get('order', None)
		if pid is not None:
			product = stripe.Product.retrieve(pid)
			self.response.write(product)


class Pay(webapp2.RequestHandler):

	def post(self):
		order = self.request.get('order', None)
		if pid is not None:
			product = stripe.Product.retrieve(pid)
			self.response.write(product)


class ListProductsJ(webapp2.RequestHandler):

	def get(self):
		products = stripe.Product.list(limit=3)
		self.response.write(json.dumps(products))


APP = webapp2.WSGIApplication([webapp2.Route(r'/', handler=ListProducts),
															 webapp2.Route(r'/j', handler=ListProductsJ)],
                              debug=True)