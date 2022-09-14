import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../constants/error_handler.dart';
import '../../../constants/global-variable.dart';
import '../../../constants/utils.dart';
import '../../../models/product.dart';
import 'package:http/http.dart' as http;

import '../../../providers/user_provider.dart';

class HomeServices {
  Future<List<Product>> fetchProductsByCategory(
      {required BuildContext context, required String category}) async {
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    List<Product> productList = [];

    try {
      http.Response response = await http.get(
          Uri.parse('$uri/product?category=$category'),
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
}
