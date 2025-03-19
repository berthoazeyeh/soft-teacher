import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'store';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from 'utils';
import { Student, ParentInfo as ParentInfo1 } from 'services/CommonServices';

const PersonInfo = ({ person }: any) => {
    const theme = useTheme();
    const styles = style(theme)

    return (
        <View style={styles.container}>
            {/* Name */}
            <View style={styles.infoRow}>
                <View style={{ flex: 1, }}>

                    <Text style={styles.label}>{person.name}</Text>
                    <Text style={styles.email}>{person.email}</Text>
                </View>
                <View style={{ backgroundColor: theme.gray, padding: 5, height: 30, paddingHorizontal: 10, borderTopRightRadius: 10, alignItems: "center", alignContent: "center" }}>

                    <Text style={styles.labelStatus}>{person?.relation?.name ?? "  "}</Text>
                </View>
            </View>



            {/* Address */}
            <View style={styles.infoRow}>
                <Text style={styles.labelAddress}>Adresse:</Text>
                <View style={styles.address}>
                    <Text style={styles.value}>{'--'}</Text>
                    {/* <Text style={styles.value}>{person.addressLine2}</Text> */}
                </View>
            </View>

            {/* Phone */}
            <View style={styles.infoRow}>
                <Text style={styles.label}></Text>
                <View style={{ borderColor: theme.gray, borderWidth: 1, padding: 5, paddingHorizontal: 10, borderRadius: 20, flexDirection: "row", gap: 10, alignItems: "center" }}>

                    <MaterialCommunityIcons name={"phone-classic"} size={25} color={theme.primary} />
                    <Text style={styles.value}>{person.mobile}</Text>

                </View>
            </View>
            {/* Contact Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.contactButton} onPress={() => { }}>
                    <MaterialCommunityIcons name={"chat-processing-outline"} size={20} color={theme.secondaryText} />
                    <Text style={styles.contactButtonText}>Le contacter</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
const GuardiansScreen = (props: { student: Student }) => {
    const { student } = props
    const theme = useTheme();
    const data = [
        {
            name: "M. BERNARD Pierre",
            status: "Tuteur",
            addressLine1: "12 rue du moulin",
            addressLine2: "13013 Marseille - France",
            phone: "(+596) 6 96 96 96 96",
            email: "bernard.pierre@example.com",
        },
        {
            name: "Mme DURAND Sophie",
            status: "Mere",
            addressLine1: "20 rue de la République",
            addressLine2: "75001 Paris - France",
            phone: "(+33) 1 23 45 67 89",
            email: "durand.sophie@example.com",
        },
        {
            name: "M. MARTIN Jacques",
            status: "Pere",
            addressLine1: "30 boulevard Saint-Germain",
            addressLine2: "75005 Paris - France",
            phone: "(+33) 6 12 34 56 78",
            email: "martin.jacques@example.com",
        }
    ];
    // student.parents
    const renderItem = ({ item }: { item: ParentInfo1 }) => <PersonInfo person={item} />;
    const styles = style(theme)

    return (
        <FlatList
            data={student?.parents ?? []}
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
        paddingHorizontal: 15,
        paddingVertical: 30,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        gap: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 10,
        flex: 1,
        justifyContent: "space-between",
    },
    label: {
        fontSize: 14,
        marginRight: 10,
        ...Theme.fontStyle.inter.bold,
        color: theme.primaryText
    },
    email: {
        fontSize: 12,
        ...Theme.fontStyle.inter.regular,
        color: theme.primaryText
    },
    value: {
        fontSize: 16,
        marginRight: 10,
        ...Theme.fontStyle.inter.bold,
        color: theme.primaryText
    },
    labelAddress: {
        fontSize: 16,
        marginRight: 10,
        ...Theme.fontStyle.inter.regular,
        color: theme.primaryText
    },
    labelStatus: {
        textAlign: "center",
        fontSize: 16,
        marginRight: 10,
        ...Theme.fontStyle.inter.semiBold,
        color: theme.primary
    },
    address: {
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
});

export default GuardiansScreen;
