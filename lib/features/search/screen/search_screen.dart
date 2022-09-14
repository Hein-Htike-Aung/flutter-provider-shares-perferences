import 'package:flutter/material.dart';
import 'package:mobile/common/widgets/loader.dart';
import 'package:mobile/features/home/widgets/address_box.dart';
import 'package:mobile/features/product_details/product_details_screen.dart';
import 'package:mobile/features/search/services/search_services.dart';
import 'package:mobile/features/search/widgets/searched_products.dart';

import '../../../constants/global-variable.dart';
import '../../../models/product.dart';

class SearchScreen extends StatefulWidget {
  static const String routeName = '/search-screen';

  final String searchQuery;

  const SearchScreen({super.key, required this.searchQuery});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  List<Product>? products;
  final SearchService searchService = SearchService();

  @override
  void initState() {
    super.initState();
    fetchProductsByName();
  }

  fetchProductsByName() async {
    products = await searchService.fetchProductsByName(
        context: context, productName: widget.searchQuery);

    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    void navigateToSearchScreen(String query) {
      Navigator.pushNamed(context, SearchScreen.routeName, arguments: query);
    }

    return products == null
        ? const Loader()
        : Scaffold(
            appBar: PreferredSize(
              preferredSize: const Size.fromHeight(60),
              child: AppBar(
                flexibleSpace: Container(
                  decoration: const BoxDecoration(
                    gradient: GlobalVariables.appBarGradient,
                  ),
                ),
                title: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Search Box
                    Expanded(
                      child: Container(
                          height: 42,
                          margin: const EdgeInsets.only(left: 15),
                          child: Material(
                            borderRadius: BorderRadius.circular(7),
                            elevation: 1,
                            child: TextFormField(
                              onFieldSubmitted: navigateToSearchScreen,
                              decoration: InputDecoration(
                                prefixIcon: InkWell(
                                  onTap: () {},
                                  child: const Padding(
                                    padding: EdgeInsets.only(left: 6),
                                    child: Icon(
                                      Icons.search,
                                      color: Colors.black,
                                      size: 23,
                                    ),
                                  ),
                                ),
                                filled: true,
                                fillColor: Colors.white,
                                contentPadding: const EdgeInsets.only(top: 10),
                                border: const OutlineInputBorder(
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(7)),
                                  borderSide: BorderSide.none,
                                ),
                                enabledBorder: const OutlineInputBorder(
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(7)),
                                  borderSide: BorderSide(
                                      color: Colors.black38, width: 1),
                                ),
                                hintText: "Search Amazon.in",
                                hintStyle: const TextStyle(
                                    fontWeight: FontWeight.w500, fontSize: 17),
                              ),
                            ),
                          )),
                    ),
                    // icon
                    Container(
                      color: Colors.transparent,
                      height: 42,
                      margin: const EdgeInsets.symmetric(horizontal: 10),
                      child:
                          const Icon(Icons.mic, color: Colors.black, size: 25),
                    )
                  ],
                ),
              ),
            ),
            // Searched Products
            body: products == null
                ? const Loader()
                : Column(
                    children: [
                      const AddressBox(),
                      const SizedBox(height: 10),
                      Expanded(
                        child: ListView.builder(
                          itemCount: products!.length,
                          itemBuilder: (context, index) {
                            return GestureDetector(
                              onTap: () {
                                Navigator.pushNamed(
                                    context, ProductDetailScreen.routeName,
                                    arguments: products![index]);
                              },
                              child: SearchedProduct(
                                product: products![index],
                              ),
                            );
                          },
                        ),
                      )
                    ],
                  ),
          );
  }
}
