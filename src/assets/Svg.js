import React, { useEffect } from "react";
import { View } from "react-native";
import { Svg, Path, Stop, LinearGradient, G } from "react-native-svg";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
  SlideInUp,
} from "react-native-reanimated";

function Logo() {
  const iso = {
    isolation: "isolate",
  };
  const color1 = {
    stopColor: "rgb(29,129,198)",
  };
  const color2 = {
    stopColor: "rgb(21,152,214)",
  };
  const color3 = {
    stopColor: "rgb(122,189,35)",
  };
  const color4 = {
    stopColor: "rgb(133,206,38)",
  };
  const color5 = {
    stopColor: "rgb(122,189,35)",
  };

  const AnimatedPath = Animated.createAnimatedComponent(Path);
  const rotation = useSharedValue(0.1);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateX: `${rotation.value}deg`,
        },
      ],
    };
  }, [rotation.value]);
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(0 - 360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      0
    );
    return () => cancelAnimation(rotation);
  }, []);

  return (
    <View>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={iso}
        viewBox="0 0 180 90"
        width="180pt"
        height="90pt"
      >
        <G>
          <LinearGradient
            id="_lgradient_38"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientTransform="matrix(0,-67.525,-65.499,0,35.082,78.918)"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopOpacity="1" style={color1} />
            <Stop offset="100%" stopOpacity="1" style={color2} />
          </LinearGradient>
          <AnimatedPath
            d=" M 54.374 11.394 C 54.374 16.875 54.183 21.937 53.433 26.58 C 52.679 31.224 51.941 35.464 50.753 39.302 C 49.562 43.139 48.195 46.57 46.753 49.603 C 45.316 52.639 43.784 55.244 42.409 57.439 C 40.406 60.601 38.82 63.194 37.007 65.228 C 35.191 67.262 35.206 66.96 35.206 66.96 C 34.093 65.807 35.206 66.96 33.48 65.034 C 31.581 62.921 29.605 60.181 27.605 56.956 C 26.226 54.701 25.038 52.164 23.632 49.023 C 22.257 45.959 20.976 42.575 19.788 38.77 C 18.601 34.964 17.417 30.789 16.663 26.242 C 15.913 21.695 15.253 16.746 15.253 11.394 L 5.804 11.394 C 5.804 21.582 7.179 31.288 9.933 40.509 C 11.058 44.187 12.386 47.751 13.921 51.201 C 15.452 54.648 17.218 57.955 19.222 61.121 C 20.909 63.827 22.566 66.178 24.195 68.179 C 25.824 70.177 27.277 71.857 28.562 73.209 C 29.839 74.563 30.89 75.577 31.702 76.258 C 32.515 76.934 32.952 77.305 33.015 77.369 L 34.988 78.915 L 37.05 77.466 C 37.116 77.402 37.55 77.047 38.366 76.403 C 39.179 75.759 40.226 74.788 41.511 73.499 C 42.788 72.206 44.245 70.584 45.874 68.61 C 47.495 66.649 49.156 64.309 50.847 61.599 C 52.847 58.502 54.632 55.244 56.195 51.83 C 57.757 48.41 59.074 44.835 60.136 41.09 C 62.952 31.932 64.359 22.034 64.359 11.394 L 54.374 11.394 Z "
            fill="url(#_lgradient_38)"
          />

          <AnimatedPath
            style={[animatedStyles]}
            d=" M 92.956 46.454 C 93.995 39.08 107.972 22.324 107.972 22.324 C 107.972 22.324 104.952 45.62 100.077 51.186 C 98.714 52.744 92.187 51.89 92.956 46.454 Z "
            fill="rgb(238,32,54)"
          />

          <LinearGradient
            id="_lgradient_39"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientTransform="matrix(12.097,0,0,-12.471,113.166,23.015)"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopOpacity="1" style={color3} />
            <Stop offset="100%" stopOpacity="1" style={color4} />
          </LinearGradient>
          <Path
            d=" M 113.167 24.147 C 115.019 25.525 116.679 27.16 118.105 28.996 L 125.265 23.741 C 123.355 21.204 121.109 18.944 118.605 17.032 L 113.167 24.147 Z "
            fill="url(#_lgradient_39)"
          />
          <LinearGradient
            id="_lgradient_40"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientTransform="matrix(11.735,0,0,-12.098,105.774,17.582)"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopOpacity="1" style={color5} />
            <Stop offset="100%" stopOpacity="1" style={color4} />
          </LinearGradient>
          <Path
            d=" M 105.773 20.382 C 108.019 21.075 110.128 22.086 112.058 23.366 L 117.507 16.234 C 114.788 14.33 111.788 12.824 108.585 11.797 L 105.773 20.382 Z "
            fill="url(#_lgradient_40)"
          />
          <LinearGradient
            id="_lgradient_41"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientTransform="matrix(13.236,0,0,-13.645,74.559,20.2)"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopOpacity="1" style={color5} />
            <Stop offset="100%" stopOpacity="1" style={color4} />
          </LinearGradient>
          <Path
            d=" M 74.558 20.68 L 81.136 26.697 C 83.074 24.728 85.32 23.08 87.796 21.848 L 83.956 13.701 C 80.441 15.461 77.269 17.833 74.558 20.68 Z "
            fill="url(#_lgradient_41)"
          />
          <LinearGradient
            id="_lgradient_42"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientTransform="matrix(10.371,0,0,-10.692,64.901,39.252)"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopOpacity="1" style={color5} />
            <Stop offset="100%" stopOpacity="1" style={color4} />
          </LinearGradient>
          <Path
            d=" M 64.902 45 C 64.902 45.125 64.909 45.254 64.909 45.378 L 73.695 45.378 C 73.695 45.254 73.687 45.125 73.687 45 C 73.687 41.827 74.249 38.79 75.273 35.984 L 66.929 33.124 C 65.616 36.829 64.902 40.832 64.902 45 Z "
            fill="url(#_lgradient_42)"
          />
          <LinearGradient
            id="_lgradient_43"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientTransform="matrix(61.225,0,0,-63.119,64.944,63.235)"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopOpacity="1" style={color5} />
            <Stop offset="100%" stopOpacity="1" style={color4} />
          </LinearGradient>
          <Path
            d=" M 64.945 46.715 C 65.812 65.087 80.585 79.758 98.616 79.758 C 109.992 79.758 120.062 73.919 126.167 64.998 L 119.097 59.619 C 114.593 66.307 107.097 70.701 98.616 70.701 C 85.429 70.701 74.605 60.09 73.745 46.715 L 64.945 46.715 Z "
            fill="url(#_lgradient_43)"
          />
          <LinearGradient
            id="_lgradient_44"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientTransform="matrix(12.78,0,0,-13.176,67.403,28.224)"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopOpacity="1" style={color3} />
            <Stop offset="100%" stopOpacity="1" style={color4} />
          </LinearGradient>
          <Path
            d=" M 67.402 31.875 L 75.765 34.743 C 76.863 32.149 78.359 29.777 80.183 27.711 L 73.616 21.703 C 71.011 24.675 68.898 28.114 67.402 31.875 Z "
            fill="url(#_lgradient_44)"
          />
          <LinearGradient
            id="_lgradient_45"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientTransform="matrix(10.875,0,0,-11.211,85.172,15.833)"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopOpacity="1" style={color5} />
            <Stop offset="100%" stopOpacity="1" style={color4} />
          </LinearGradient>
          <Path
            d=" M 85.171 13.134 L 89.011 21.285 C 91.214 20.33 93.577 19.698 96.046 19.432 L 95.683 10.384 C 91.98 10.713 88.441 11.664 85.171 13.134 Z "
            fill="url(#_lgradient_45)"
          />
          <LinearGradient
            id="_lgradient_46"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientTransform="matrix(10.524,0,0,-10.849,96.849,15.142)"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopOpacity="1" style={color5} />
            <Stop offset="100%" stopOpacity="1" style={color4} />
          </LinearGradient>
          <Path
            d=" M 96.851 10.291 L 97.21 19.339 C 97.675 19.315 98.144 19.295 98.616 19.295 C 100.663 19.295 102.652 19.557 104.554 20.04 L 107.37 11.43 C 104.581 10.657 101.644 10.242 98.616 10.242 C 98.023 10.242 97.437 10.259 96.851 10.291 Z "
            fill="url(#_lgradient_46)"
          />
          <LinearGradient
            id="_lgradient_47"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientTransform="matrix(0,-68.414,-66.362,0,152.29,79.447)"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopOpacity="1" style={color1} />
            <Stop offset="100%" stopOpacity="1" style={color2} />
          </LinearGradient>
          <Path
            d=" M 151.046 11.076 C 148.62 11.14 146.21 11.643 144.191 12.457 C 142.175 13.271 140.327 14.527 138.886 15.936 C 137.441 17.346 136.331 19.13 135.523 21.071 C 134.714 23.012 134.296 25.292 134.359 27.663 C 134.417 29.979 134.824 32.23 135.488 33.977 C 136.152 35.726 137.195 37.276 138.409 38.645 C 139.628 40.014 141.195 41.303 142.964 42.382 C 144.73 43.462 146.89 44.593 149.159 45.628 L 154.183 47.831 C 158.242 49.551 160.812 51.278 162.843 53.203 C 164.87 55.128 166.011 57.515 166.093 60.866 C 166.14 62.634 165.808 64.068 165.163 65.454 C 164.519 66.842 163.784 67.962 162.624 68.969 C 161.472 69.975 160.23 70.704 158.616 71.264 C 157.007 71.828 155.437 72.166 153.605 72.214 C 151.363 72.275 149.519 72.022 147.796 71.519 C 146.066 71.019 144.718 70.281 143.425 69.368 C 142.132 68.462 141.003 67.391 139.999 66.198 C 138.995 65.006 138.382 63.787 137.64 62.405 L 130.32 66.468 C 131.195 68.211 132.421 69.468 133.734 71.014 C 135.046 72.569 136.902 74.321 138.765 75.516 C 140.624 76.716 142.866 77.772 145.253 78.436 C 147.632 79.105 151.023 79.58 154.093 79.5 C 156.933 79.423 159.484 79.033 161.859 78.178 C 164.226 77.325 166.859 75.835 168.597 74.289 C 170.331 72.751 171.784 70.62 172.706 68.433 C 173.624 66.242 174.257 63.407 174.191 60.726 C 174.128 58.293 173.847 55.825 173.12 53.892 C 172.394 51.963 171.534 49.925 170.163 48.346 C 168.796 46.764 166.906 45.169 164.898 43.912 C 162.882 42.656 160.242 41.544 157.55 40.397 L 152.156 38.069 C 150.363 37.264 149.195 36.692 147.902 35.935 C 146.613 35.178 145.531 34.328 144.687 33.466 C 143.835 32.608 143.238 31.613 142.976 30.753 C 142.534 29.282 142.499 28.598 142.445 27.14 C 142.359 24.652 143.374 22.199 144.753 20.862 C 146.421 19.242 148.128 18.389 151.12 18.321 C 154.046 18.253 155.992 18.756 157.742 20.053 C 159.495 21.353 161.128 22.924 162.417 24.897 L 169.038 20.471 C 167.249 17.596 164.64 15.333 161.851 13.58 C 159.222 11.93 155.734 11.068 151.784 11.068 C 151.542 11.068 151.292 11.068 151.046 11.076 Z "
            fill="url(#_lgradient_47)"
          />
        </G>
      </Svg>
    </View>
  );
}

export default Logo;
//   let iconRotate = useDerivedValue(() => {
//     return interpolate(progress.value, [0, 1], [0, 180]);
//   });
//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         {
//           duration: 500,
//           rotate: iconRotate.value + "deg",
//         },
//       ],
//     };
//   });
//   const vOffset = useSharedValue(0);

//   const config = {
//     duration: 1500,
//     easing: Easing.bezier(0.5, 0.01, 0, 1),
//   };

//   const animatedProps = useAnimatedProps(() => {
//     return {
//       y: withTiming(vOffset.value, config),
//     };
//   });

//   const animateIn = () => {
//     vOffset.value = 0;
//   };

//   useEffect(() => {
//     animateIn();
//   }, []);
