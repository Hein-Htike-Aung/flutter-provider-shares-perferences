import 'package:flutter/material.dart';
import 'package:mobile/common/widgets/bottom_bar.dart';
import 'package:mobile/constants/global-variable.dart';
import 'package:mobile/features/admin/screens/admin_screen.dart';
import 'package:mobile/features/auth/screens/auth_screen.dart';
import 'package:mobile/features/auth/services/auth_service.dart';
import 'package:mobile/features/home/screens/home_screen.dart';
import 'package:mobile/providers/user_provider.dart';
import 'package:mobile/router.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(
    MultiProvider(providers: [
      ChangeNotifierProvider(create: (context) => UserProvider()),
    ], child: const MyApp()),
  );
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final AuthService authService = AuthService();

  @override
  void initState() {
    super.initState();
    authService.getUserData(context: context);
  }

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<UserProvider>(context).user;

    @override
    void initState() {
      super.initState();
    }

    return MaterialApp(
      title: "Amazon Clone",
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: GlobalVariables.backgroundColor,
        colorScheme: const ColorScheme.light(
          primary: GlobalVariables.secondaryColor,
        ),
        appBarTheme: const AppBarTheme(
          elevation: 0,
          iconTheme: IconThemeData(color: Colors.black),
        ),
      ),
      onGenerateRoute: (settings) => generateRoute(settings),
      home: user.accessToken.isNotEmpty
          ? user.type == 'user'
              ? const BottomBar()
              : const AdminScreen()
          : const AuthScreen(),
    );
  }
}
