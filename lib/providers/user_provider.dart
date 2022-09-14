import 'package:flutter/material.dart';
import 'package:mobile/models/user.dart';

class UserProvider extends ChangeNotifier {
  User _user = User(
      id: '',
      name: '',
      email: '',
      password: '',
      address: '',
      type: '',
      accessToken: '');

  User get user => _user;

  void setUser(String user) {
    _user = User.fromJson(user);
    // notify all the listener that the user value is changed
    notifyListeners();
  }
}
