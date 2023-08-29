import * as React from 'react';

import {
  StyleSheet,
  View,
  Platform,
  TouchableHighlight,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { ArViewerView } from 'react-native-ar-viewer';
import RNFS from 'react-native-fs';

const IMG_H = 70;
const IMG_W = 75;

export default function App() {
  const [localModelPath, setLocalModelPath] = React.useState<string>();
  const [showArView, setShowArView] = React.useState(true);
  const ref = React.useRef() as React.MutableRefObject<ArViewerView>;

  const MODELS_AND = [
    // 'https://github.com/riderodd/react-native-ar/blob/main/example/src/dice.glb?raw=true',
    'https://github.com/dhruv-codestudio/ar-demo/blob/main/src/models/marbel_horse.glb?raw=true',
    'https://github.com/dhruv-codestudio/ar-demo/blob/main/src/models/vase.glb?raw=true',
    'https://github.com/dhruv-codestudio/ar-demo/blob/main/src/models/tesla_logo.glb?raw=true',
    'https://github.com/dhruv-codestudio/ar-demo/blob/main/src/models/table.glb?raw=true',
    'https://github.com/dhruv-codestudio/ar-demo/blob/main/src/models/antiques_watch.glb?raw=true',
  ]


  const loadPath = async (model: string) => {

    const modelSrc =
      Platform.OS === 'android'
        // ? `https://github.com/dhruv-codestudio/ar-demo/blob/6b524ad928fa7d17b9fe223bdc233d58b6361d0e/src/models/pizza.obj`
        // ? `https://github.com/dhruv-codestudio/ar-demo/blob/main/src/models/${model}.glb?raw=true`
        ? `https://github.com/dhruv-codestudio/ar-demo/blob/main/src/models/${model}.glb?raw=true`
        : 'https://github.com/riderodd/react-native-ar/blob/main/example/src/dice.usdz?raw=true';

    
    const modelPath = `${RNFS.DocumentDirectoryPath}/${model}.${
      Platform.OS === 'android' ? 'glb' : 'usdz'
    }`;
    const exists = await RNFS.exists(modelPath);
    // console.log(MODELS_AND[ind]);
    if (!exists) {
      await RNFS.downloadFile({
        fromUrl: modelSrc,
        toFile: modelPath,
      }).promise;
    }
    console.log(modelPath);

    setLocalModelPath(modelPath);
  };

  React.useEffect(() => {
    loadPath('burger');
    // console.log(RNFS.readDir);
  },[]);

  const takeSnapshot = () => {
    ref.current?.takeScreenshot().then(async (base64Image) => {
      const date = new Date();
      const filePath = `${
        RNFS.CachesDirectoryPath
      }/arscreenshot-${date.getFullYear()}-${date.getMonth()}-${date.getDay()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.jpg`;
      await RNFS.writeFile(filePath, base64Image, 'base64');
      console.log('Screenshot written to ' + filePath);
    });
  };

  const reset = () => {
    ref.current?.reset();
  };

  const rotate = () => {
    ref.current?.rotate(0, 25, 0);
  };

  const mountUnMount = () => setShowArView(!showArView);

  function changeModel(model: string): void {
    ref.current?.reset();
    loadPath(model)
    // setLocalModelPath
  }

  return (
    <View style={styles.container}>
      {localModelPath && showArView && (
        <ArViewerView
          model={localModelPath}
          style={styles.arView}
          disableInstantPlacement={false}
          planeOrientation={'horizontal'}
          manageDepth
          allowRotate
          allowScale
          allowTranslate
          onStarted={() => console.log('started')}
          onEnded={() => console.log('ended')}
          onModelPlaced={() => console.log('model displayed')}
          onModelRemoved={() => console.log('model not visible anymore')}
          ref={ref}
        />
      )}
      {/* <View style={styles.imageGrid}>
          <TouchableOpacity onPress={() => changeModel('nike_shoe')} style={styles.imageContainer}>
              <Image 
              source={require('../src/Images/table.png')} 
              style={{height:IMG_H,width:IMG_W}}
              />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeModel('vase')} style={styles.imageContainer}>
              <Image 
              source={require('../src/Images/vase.png')} 
              style={{height:IMG_H,width:IMG_W}}
              />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeModel('marbel_horse')} style={styles.imageContainer}>
              <Image 
              source={require('../src/Images/marbel_horse.png')} 
              style={{height:IMG_H,width:IMG_W}}
              />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeModel('tesla_logo')} style={styles.imageContainer}>
              <Image 
              source={require('../src/Images/tesla_logo.png')} 
              style={{height:IMG_H,width:IMG_W}}
              />
          </TouchableOpacity>
      </View> */}
      <View style={styles.footer}>
        <TouchableHighlight onPress={takeSnapshot} style={styles.button}>
          <Text style={{color:'black'}}>Take Snapshot</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={mountUnMount} style={styles.button}>
          <Text style={{color:'black'}}>{showArView ? 'Unmount' : 'Mount'}</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={reset} style={styles.button}>
          <Text style={{color:'black'}}>Reset</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={rotate} style={styles.button}>
          <Text style={{color:'black'}}>Rotate</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey',
    justifyContent:'center'
    // borderWidth:1
  },
  arView: {
    flex: 0.8,
  },
  imageGrid: {
    flex: 0.12,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-evenly'
  },
  imageContainer: {
    backgroundColor:'red',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10,
    overflow:'hidden'
  },
  footer: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  
  button: {
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'white',
    padding: 10,
    margin: 5,
  },
});