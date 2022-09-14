import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:mobile/common/widgets/bottom_bar.dart';
import 'package:mobile/constants/error_handler.dart';
import 'package:mobile/constants/global-variable.dart';
import 'package:mobile/constants/utils.dart';
import 'package:mobile/providers/user_provider.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../models/user.dart';
import 'package:http/http.dart' as http;

class AuthService {
  void signUpUser({
    required BuildContext context,
    required String email,
    required String password,
    required String name,
  }) async {
    try {
      User user = User(
          id: '',
          name: name,
          email: email,
          password: password,
          address: '',
          type: '',
          accessToken: '');

      http.Response res = await http.post(
        Uri.parse('$uri/auth/signup'),
        body: user.toJson(),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8'
        },
      );

      httpErrorHandler(
        response: res,
        context: context,
        onSuccess: () {
          showSnackBar(context, 'Account created! ');
        },
      );
    } catch (e) {
      showSnackBar(context, e.toString());
    }
  }

  void signInUser({
    required BuildContext context,
    required String email,
    required String password,
  }) async {
    try {
      http.Response res = await http.post(
        Uri.parse('$uri/auth/signin'),
        body: jsonEncode({'email': email, 'password': password}),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8'
        },
      );

      httpErrorHandler(
        response: res,
        context: context,
        onSuccess: () async {
          SharedPreferences preferences = await SharedPreferences.getInstance();
          // store in persistent storage
          await preferences.setString('Authorization',
              'Bearer ${json.decode(res.body)['accessToken']}');

          // ignore: use_build_context_synchronously
          Provider.of<UserProvider>(context, listen: false).setUser(res.body);

          // ignore: use_build_context_synchronously
          Navigator.pushNamedAndRemoveUntil(
              context, BottomBar.routeName, (route) => false);
        },
      );
    } catch (e) {
      showSnackBar(context, e.toString());
    }
  }

  void getUserData({
    required BuildContext context,
  }) async {
    try {
      SharedPreferences preferences = await SharedPreferences.getInstance();
      String? token = preferences.getString('Authorization');

      if (token == null) {
        preferences.setString('Authorization', '');
      }

      // Check token is valid
      var tokenRes = await http.post(
        Uri.parse('$uri/auth/isTokenValid'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': '$token'
        },
      );

      var isTokenValid = jsonDecode(tokenRes.body);

      if (isTokenValid) {
        // find Current User
        http.Response currentUserRes = await http.get(
          Uri.parse('$uri/auth/current-user'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': '$token'
          },
        );

        // ignore: use_build_context_synchronously
        Provider.of<UserProvider>(context, listen: false)
            .setUser(currentUserRes.body);
      }
    } catch (e) {
      showSnackBar(context, e.toString());
    }
  }
}
