import 'package:application/models/super_user_model.dart';
import 'package:json_annotation/json_annotation.dart';

part 'user_model.g.dart';

@JsonSerializable(explicitToJson: true)
class User {
  late String id;
  late bool isVarified;
  late String username;
  late SuperUser user;

  User({
    required this.isVarified,
    required this.username,
    required this.user,
  });

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);

  Map<String, dynamic> toJson() => _$UserToJson(this);
}
