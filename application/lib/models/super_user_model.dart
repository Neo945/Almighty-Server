import 'package:json_annotation/json_annotation.dart';

part 'super_user_model.g.dart';

@JsonSerializable(explicitToJson: true)
class SuperUser {
  late String id;
  late String email;
  late String password;

  SuperUser({
    required this.email,
    required this.password,
  });

  factory SuperUser.fromJson(Map<String, dynamic> json) => _$SuperUserFromJson(json);

  Map<String, dynamic> toJson() => _$SuperUserToJson(this);
}
