import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/constants/utils.dart';

void httpErrorHandler(
    {required http.Response response,
    required BuildContext context,
    required VoidCallback onSuccess // VoidCallback = Function()?
    }) {
  if (response.statusCode.toString().startsWith('2')) {
    onSuccess();
  } else {
    showSnackBar(context, jsonDecode(response.body)['message']);
  }
}
