import { Text, StyleSheet, View, SafeAreaView, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

type SocialLinkProps = {
  logo: string;
  platform: string;
  link: string;
};

const SocialLink = ({ logo, platform, link }: SocialLinkProps) => {

  const { t } = useTranslation();
  
  return (
  <TouchableOpacity
    style={styles.socialButton}
    onPress={async () => {
      const supported = await Linking.canOpenURL(link);
      if (supported) {
        await Linking.openURL(link);
      } else {
        console.error(t('linkError'), link);
      }
    }}
  >
    <Ionicons name={logo as keyof typeof Ionicons.glyphMap} size={20} color="black" />
    <Text style={styles.socialText}>{platform}</Text>
  </TouchableOpacity>
);}


export default function Credits() {

  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.text}>
          <Text style={styles.boldText}>DURF Tracker</Text> {t('by')}{' '}
          <Text style={styles.boldText}>Pasquale "Pico" Buonomo</Text>
        </Text>
        <View style={styles.socials}>
          <SocialLink logo="logo-github" platform="GitHub" link="https://github.com/Shyentist" />
          <SocialLink logo="link" platform="itch.io" link="https://pasquale-pico-buonomo.itch.io/" />
        </View>
        <View style={styles.socials}>
          <SocialLink logo="logo-reddit" platform="Reddit" link="https://www.reddit.com/user/Pico_Shyentist/" />
          <SocialLink logo="logo-mastodon" platform="Mastodon" link="https://mstdn.science/@pico" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>
          <Text style={styles.boldText}>DURF</Text> {t('by')}{' '}
          <Text style={styles.boldText}>Emiel Boven</Text>
        </Text>
        <View style={styles.socials}>
          <SocialLink logo="link" platform="itch.io" link="https://emielboven.itch.io/" />
          <SocialLink logo="logo-mastodon" platform="Mastodon" link="https://mstdn.science/@EmielBoven@dice.camp" />
        </View>
        <View style={styles.socials}>
          <SocialLink logo="logo-discord" platform="discord" link="https://discord.com/invite/SbdEKxMe6V" />
          <SocialLink logo="link" platform="Bluesky" link="https://bsky.app/profile/emielboven.itch.io" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: "20%",
  },
  section: {
    paddingVertical: 20,
    width: "100%",
    marginTop: "20%",
    paddingHorizontal: 8,
    borderStyle: "dashed",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#ddd",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
  boldText: {
    fontWeight: "bold"
  },
  socials: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
    marginTop: 10,
    justifyContent: "space-evenly",
  },
  socialText: {
    fontFamily: "RobotoSlab-Bold",
    fontSize: 14,
    fontWeight: 'bold'
  },
  socialButton: {
    backgroundColor: '#FFDE21',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '33%',
    flexDirection: 'row', 
    justifyContent: 'space-evenly'
  }
});
