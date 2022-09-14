import 'dart:convert';
import 'dart:io';

import 'package:cloudinary_public/cloudinary_public.dart';
import 'package:flutter/material.dart';
import 'package:mobile/constants/error_handler.dart';
import 'package:mobile/constants/utils.dart';
import 'package:mobile/models/product.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/providers/user_provider.dart';
import 'package:provider/provider.dart';

import '../../../constants/global-variable.dart';

class AdminServices {
  void sellProduct({
    required BuildContext context,
    required String name,
    required String description,
    required double price,
    required double quantity,
    required String category,
    required List<File> images,
  }) async {
    final userProvider = Provider.of<UserProvider>(context, listen: false);

    try {
      final cloudinary = CloudinaryPublic('dxlwpovsu', 'flutter-upload');
      List<String> imageUrls = [];

      for (int i = 0; i < images.length; i++) {
        CloudinaryResponse res = await cloudinary
            .uploadFile(CloudinaryFile.fromFile(images[i].path, folder: name));
        imageUrls.add(res.secureUrl);
      }

      Product product = Product(
          name: name,
          description: description,
          quantity: quantity,
          images: imageUrls,
          category: category,
          price: price);

      http.Response response = await http.post(Uri.parse('$uri/product'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            "Authorization": 'Bearer ${userProvider.user.accessToken}'
          },
          body: product.toJson());
      httpErrorHandler(
          response: response,
          context: context,
          onSuccess: () {
            showSnackBar(context, "Proudct added succesfully");
            // go back to main screen
            Navigator.pop(context);
          });
    } catch (e) {
      showSnackBar(context, e.toString());
    }
  }

  Future<List<Product>> fetchAllProducts(BuildContext context) async {
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    List<Product> productList = [];

    try {
      http.Response response = await http.get(Uri.parse('$uri/product'),
          headers: <String, String>{
            "Authorization": 'Bearer ${userProvider.user.accessToken}'
          });

      httpErrorHandler(
          response: response,
          context: context,
          onSuccess: () {
            for (int i = 0; i < jsonDecode(response.body).length; i++) {
              productList.add(
                Product.fromJson(
                  jsonEncode(jsonDecode(response.body)[i]),
                ),
              );
            }
          });
    } catch (e) {
      showSnackBar(context, e.toString());
    }

    return productList;
  }

  void deleteProduct(
      {required BuildContext context,
      required Product product,
      required VoidCallback onSuccess}) async {
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    try {
      http.Response response = await http.delete(
          Uri.parse('$uri/product/${product.id}'),
          headers: <String, String>{
            "Authorization": 'Bearer ${userProvider.user.accessToken}'
          });

      httpErrorHandler(
          response: response,
          context: context,
          onSuccess: () {
            // To refresh the products
            onSuccess();
          });
    } catch (e) {
      showSnackBar(context, e.toString());
    }
  }
}
