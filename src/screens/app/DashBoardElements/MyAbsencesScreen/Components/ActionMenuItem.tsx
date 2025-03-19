import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { Menu, Button, Provider } from 'react-native-paper';
import { useTheme } from 'store';
import { Theme } from 'utils';
import { I18n } from 'i18n';



interface AttendanceMenuProps {
    markAllPresent: () => void;
    markAllAbsent: () => void;
}

const AttendanceMenuButton: React.FC<AttendanceMenuProps> = ({ markAllPresent, markAllAbsent }) => {
    const [visible, setVisible] = useState(false);
    const theme = useTheme();
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const MyLables: any = I18n.t("Dashboard.AttendanceMenuButton")
    console.log(MyLables);
    return (

        <View style={styles.container}>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                contentStyle={{ backgroundColor: theme.primaryBackground, }}
                anchor={
                    <TouchableOpacity
                        onPress={openMenu}
                        style={{ backgroundColor: theme.primary, borderRadius: 20, justifyContent: "center", paddingHorizontal: 15, paddingVertical: 5 }}>
                        <Text style={{
                            fontSize: 15,
                            ...Theme.fontStyle.montserrat.regular,
                            color: 'white',
                            textAlign: "center"
                        }}>{MyLables?.manageAttendance}</Text>
                    </TouchableOpacity>
                } >
                <Menu.Item
                    titleStyle={{
                        fontWeight: "bold", textAlign: "center", color: theme.primary,
                        ...Theme.fontStyle?.montserrat.regular,
                    }}

                    onPress={() => {
                        markAllPresent();
                        closeMenu();
                    }}

                    title={MyLables.markAllPresent}
                    leadingIcon="check-circle"
                />
                <Menu.Item
                    titleStyle={{
                        fontWeight: "bold", textAlign: "center", color: 'red',
                        ...Theme.fontStyle.montserrat.regular,
                    }}

                    onPress={() => {
                        markAllAbsent();
                        closeMenu();
                    }}
                    title={MyLables?.markAllAbsent}
                    leadingIcon="cancel"
                />
            </Menu>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        // paddingTop: 50,
        flexDirection: 'row',
        justifyContent: 'center',
    },
});

export default AttendanceMenuButton;
