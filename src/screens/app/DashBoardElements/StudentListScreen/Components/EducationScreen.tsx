import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'store';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from 'utils';
import { Divider } from 'react-native-paper';

const PersonInfo = ({ person }: any) => {
    const theme = useTheme();
    const styles = style(theme)

    return (
        <View style={styles.container}>
            {/* Name */}
            <View style={[styles.infoRow, styles.box]}>
                <View style={styles.address}>
                    <MaterialCommunityIcons name={"book-open"} size={25} color={theme.primary} />
                    <Text style={styles.value}>{"3eme"}</Text>
                </View>
                <View style={styles.address}>
                    <MaterialCommunityIcons name={"door"} size={25} color={theme.primary} />
                    <Text style={styles.value}>{"3eme-B"}</Text>
                </View>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.labelAddress}>Options:</Text>
                <View style={styles.address1}>
                    <Text style={styles.value1}>{"ANGLAIS LV1 "}, {"ESPAGNOL LV2"}</Text>
                </View>
            </View>
            <Divider />
            <View >
                <Text style={styles.labelPrincipal}>Professeur principal</Text>
                <View>
                    <Text style={styles.label}>{person.name}</Text>
                    <Text style={styles.email}>{person.email}</Text>
                </View>

            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.contactButton} onPress={() => { }}>
                    <MaterialCommunityIcons name={"chat-processing-outline"} size={20} color={theme.secondaryText} />
                    <Text style={styles.contactButtonText}>Le contacter</Text>
                </TouchableOpacity>
            </View>

            <Divider />
            <View style={styles.section}>
                <View style={styles.infoRow}>
                    <Text style={styles.sectionTitle}>Attestations</Text>
                    <MaterialCommunityIcons name={"plus-circle"} size={30} color={theme.primary} />
                </View>
                <Text style={styles.sectionContent}>Aucune attestation n'a été renseignée</Text>
            </View>
            <Divider />

        </View>
    );
};
const EducationScreen = () => {
    const theme = useTheme();
    const data = [
        {
            name: "M. PROFESSEUR Maxime",
            status: "Tuteur",
            addressLine1: "12 rue du moulin",
            addressLine2: "13013 Marseille - France",
            phone: "(+596) 6 96 96 96 96",
            email: "bernard.pierre@example.com",
        },

    ];

    const renderItem = ({ item }: any) => <PersonInfo person={item} />;
    const styles = style(theme)

    return (
        <FlatList
            data={data}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContent}
        />
    );

};

const style = (theme: any) => StyleSheet.create({
    container: {
        paddingBottom: 20,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        gap: 10,

    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 10,
        justifyContent: "space-between",
    },
    box: {
        borderWidth: 1,
        borderColor: theme.gray,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        marginRight: 10,
        ...Theme.fontStyle.montserrat.bold,
        color: theme.primaryText
    },
    labelPrincipal: {
        fontSize: 16,
        textAlign: "center",
        paddingVertical: 10,
        ...Theme.fontStyle.montserrat.bold,
        color: theme.primaryText
    },
    email: {
        fontSize: 12,
        ...Theme.fontStyle.montserrat.regular,
        color: theme.primaryText
    },
    value: {
        fontSize: 16,
        marginRight: 10,
        ...Theme.fontStyle.montserrat.bold,
        color: theme.primaryText
    },
    value1: {
        fontSize: 14,
        marginRight: 10,
        ...Theme.fontStyle.montserrat.semiBold,
        color: theme.primaryText
    },
    labelAddress: {
        fontSize: 16,
        marginRight: 10,
        ...Theme.fontStyle.montserrat.regular,
        color: theme.primaryText
    },
    labelStatus: {
        textAlign: "center",
        fontSize: 16,
        marginRight: 10,
        ...Theme.fontStyle.montserrat.semiBold,
        color: theme.primary
    },
    address: {
        flex: 1,
        flexDirection: 'column',
        alignItems: "center",
        gap: 9
    },
    address1: {
        flex: 1,
        flexDirection: 'column',

    },
    listContent: {
        padding: 2,
    },
    buttonContainer: {
        width: "100%",
        marginTop: 2,
        alignItems: 'center',
    },
    contactButton: {
        width: "100%",
        flexDirection: "row", justifyContent: "center",
        alignItems: "center",
        gap: 10,
        backgroundColor: theme.primary,
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    contactButtonText: {
        textAlign: 'center',

        color: theme.secondaryText,
        fontSize: 14,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        ...Theme.fontStyle.montserrat.bold,
        color: theme.primaryText,
        marginBottom: 5,
    },
    sectionContent: {
        fontSize: 16,
        ...Theme.fontStyle.montserrat.regular,
        color: theme.primaryText,
    },
});



export default EducationScreen;
