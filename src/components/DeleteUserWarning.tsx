import { Button, Input, Text } from "@rneui/themed";
import { View } from "react-native";
import Colours from "../config/Colours";
import Fonts from "../config/Fonts";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { deleteUser } from "../operations/User";
import { useTheme } from "../contexts/ThemeContext";

export default function DeleteUserWarning({
    session,
    loading,
    setLoading,
    setDeleteUserWarning,
}: {
    session: Session;
    loading: boolean;
    setLoading: (value: boolean) => void;
    setDeleteUserWarning: (value: boolean) => void;
}) {
    // Check that email matches.
    const { theme } = useTheme(); // Get the current theme
    const [deleteUserEmail, setDeleteUserEmail] = useState("");
    const [enableDeleteUser, setEnableDeleteUser] = useState(false);

    useEffect(() => {
        if (deleteUserEmail === session?.user?.email) setEnableDeleteUser(true);
        else setEnableDeleteUser(false);
    }, [deleteUserEmail]);

    return (
        <View style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 100,
        }}>
            <View style={{
                position: "absolute",
                alignSelf: "center",
                top: "30%",
                backgroundColor: Colours.dealItem[theme],
                display: "flex",
                width: "85%",
                padding: 10,
            }}>
                <Text style={{
                    fontSize: 23,
                    fontWeight: 'bold',
                    color: Colours.text[theme],
                    alignSelf: "center",
                    fontFamily: Fonts.condensed,
                }}>
                    WARNING!!
                </Text>
                <Text style={{
                    color: Colours.text[theme],
                    fontFamily: Fonts.condensed,
                }}>
                    You are deleting your account. If you are sure this is what you want, please enter your email.
                </Text>
                <Input
                    label="Email"
                    style={{
                        color: Colours.text[theme],
                        fontFamily: Fonts.condensed,
                    }}
                    onChangeText={(text) => setDeleteUserEmail(text)}
                />
                <Button
                    title="Cancel"
                    onPress={() => setDeleteUserWarning(false)}
                    color={Colours.primary[theme]}
                    disabled={loading}
                />
                <Button
                    title="Delete Account"
                    onPress={() => deleteUser(session, setLoading)}
                    color={Colours.primary[theme]}
                    disabled={loading || !enableDeleteUser}
                />
            </View>
        </View>
    );
}
