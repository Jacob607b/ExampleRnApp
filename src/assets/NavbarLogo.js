import { View, Image } from "react-native";
import React from "react";

export default function NavbarLogo() {
  return (
    <View>
      {/* <View style={{height: 30, backgroundColor : '#fff', borderRadius: 10}}> */}
      <Image
        style={{ height: 30 }}
        source={require("./navbarLogo.webp")}
        resizeMode="contain"
      ></Image>
      {/* </View> */}
    </View>
  );
}
