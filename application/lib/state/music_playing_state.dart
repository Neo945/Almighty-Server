import 'package:application/models/user_model.dart';
import 'package:flutter/foundation.dart';

class UserState with ChangeNotifier {
  bool isPlaying = false;

  void play(User? music, isPlaying) {
    this.isPlaying = isPlaying;
    notifyListeners();
  }
}
