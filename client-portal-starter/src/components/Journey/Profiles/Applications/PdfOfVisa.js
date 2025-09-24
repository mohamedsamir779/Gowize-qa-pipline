/* eslint-disable indent */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const PdfOfVisa = ({ clientData, ipLinks, addressLinks, selfiePhoto, savedSignature }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 20,
      fontFamily: "Helvetica",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "80%",
      marginBottom: 20,
    },
    headerImageContainer: {
      width: 80,
    },
    headerImage: {
      width: 80,
      height: "auto",
    },
    headerTitleContainer: {
      flex: 1,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 14,
      fontWeight: "bold",
      textAlign: "center",
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: "white",
      marginTop: 20,
      marginBottom: 7,
      textAlign: "center",
      backgroundColor: "#1c2d58",
    },
    row: {
      flexDirection: "row",
      marginVertical: 5,
    },
    col: {
      flex: 1,
      paddingHorizontal: 5,
    },
    key: {
      fontWeight: "bold",
      fontSize: 10,
      color: "#2bb0c9",
    },
    value: {
      fontSize: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      paddingBottom: 3,
    },
    signatureRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginTop: 30,
    },
    KycRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginTop: 30,
    },
    signatureBox: {
      width: "30%",
      alignItems: "center",
    },
    signatureLine: {
      borderTopWidth: 1,
      borderTopColor: "#000",
      width: "100%",
      paddingTop: 5,
      fontSize: 10,
    },
    signatureText: {
      fontSize: 12,
      marginBottom: 15,
    },

    declarationText: {
      fontSize: 10,
      lineHeight: 1.4,
      flex: 1,
    },
    declarationItem: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",
      marginBottom: 5,
    },
    kycImage: {
      width: 300,
      height: 250,
    },
  });

  const declarations = [
    "By clicking here I give my consent for ITGeeks to contact me for marketing purposes. You can opt out at any time.",
    "You have read, understood, and agreed to ITGeeks's client agreement which includes order execution policy, ",
    "You confirm that you do not breach any regulation of your country of residence in trading with ITGeeks.",
    "Your electronic signature is considered a legal and official signature",
    "You have read, understood, and agreed to ALFORB FX's client agreement which includes order execution policy.",
    "You confirm that you do not breach any regulation of your country of residence in trading with ALFORB FX.",
    "Your electronic signature is considered a legal and official signature.",
  ];

  const { firstName, lastName, email, phone, address, nationality, gender } =
    clientData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Now properly centered */}
        <View style={styles.header}>
          <View style={styles.headerImageContainer}>
            <Image style={styles.headerImage} src="/logo512.png" />
          </View>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              Online Individual Application
            </Text>
          </View>
          <View style={styles.headerImageContainer}></View>
        </View>

        {/* General Information */}
        <Text style={styles.sectionTitle}>General Information</Text>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.key}>Title:</Text>
            <Text style={styles.value}>Title</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.key}>First Name:</Text>
            <Text style={styles.value}>{firstName}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.key}>Last Name:</Text>
            <Text style={styles.value}>{lastName}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.key}>Cell Phone:</Text>
            <Text style={styles.value}>{phone}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.key}>Email:</Text>
            <Text style={styles.value}>{email}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.key}>Address:</Text>
            <Text style={styles.value}>{address}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.key}>Nationality:</Text>
            <Text style={styles.value}>{nationality}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.key}>Gender:</Text>
            <Text style={styles.value}>{gender}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Declarations</Text>

        {/* Checkboxes with proper checked styling */}
        {declarations.map((declaration, index) => (
          <View key={index} style={styles.declarationItem}>
            <Image
              style={{
                width: 20,
                height: 20,
              }}
              src="/img/rightCheck.png"
            />
            <Text style={styles.declarationText}>{declaration}</Text>
          </View>
        ))}
        {/* Signatures */}
        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <Image
              style={{
                width: 100,
                height: 100,
              }}
              src={savedSignature}
            />
            <Text style={styles.signatureLine}>Company Signature</Text>
          </View>
          <View style={styles.signatureBox}>
            <Image
              style={{
                width: 100,
                height: 100,
              }}
              src={savedSignature}
            />
            <Text style={styles.signatureLine}>Client Signature</Text>
          </View>
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
        {/* Selfie Photo if available */}
        <Text style={styles.sectionTitle} marginTop="300">
          Selfie Photo
        </Text>
        {selfiePhoto && (
          <View
            style={{
              marginTop: 20,
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: 200,
                height: 200,
              }}
              src={selfiePhoto}
            />
          </View>
        )}
        <Text style={styles.sectionTitle}>KYC Documents</Text>
        <View style={styles.KycRow}>
          {ipLinks && ipLinks.map((link, index) => (
            <Image
              key={index}
              style={(styles.image, styles.kycImage)}
              src={link}
            />
          ))}
          {/* <Text style={styles.sectionTitle}>Proof of Address</Text> */}
          {addressLinks && addressLinks.map((link, index) => (
            <Image
              key={index}
              style={(styles.image, styles.kycImage)}
              src={link}
            />
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default PdfOfVisa;