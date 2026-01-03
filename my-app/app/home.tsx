import {View,Text,Image, StyleSheet, TouchableOpacity} from 'react-native'
const First = () => {
  return (
    <View style={styles.mainBox}>
      
      <View style={styles.centerGroup}>
        <Image 
          source={require("../assets/images/Bloodicon.png")}
          style={styles.mainImage}
        />
        <Text style={styles.title}>Donate Blood</Text>
        <Text style={styles.desc}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero pariatur consequatur aut aliquam.
        </Text>
      </View>

      
      <TouchableOpacity style={styles.firstButton}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
export default First;
const styles = StyleSheet.create({
  mainBox: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40, 
    paddingTop: 60,
    justifyContent: "space-between", 
    alignItems: "center",
  },
  centerGroup: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1, 
  },
  mainImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24, 
    fontWeight: "bold",
    marginBottom: 10,
  },
  desc: {
    textAlign: "center",
    color: '#666',
  },
  firstButton: {
    backgroundColor: "red",
    width: "100%", 
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 18,
    color: "white"
  }
});