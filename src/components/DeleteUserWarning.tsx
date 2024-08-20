import { Button, Input, Text } from "@rneui/themed"
import { StyleSheet, View } from "react-native"
import Colours from "../config/Colours"
import Fonts from "../config/Fonts"
import { Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { deleteUser } from "../operations/User"


export default function DeleteUserWarning(
    {
        session,
        loading,
        setLoading,
        setDeleteUserWarning,
    }: {
        session: Session,
        loading: boolean,
        setLoading: (value: boolean) => void,
        setDeleteUserWarning: (value: boolean) => void,
    }
) {
    {/* Check that email matches. */ }
    const [deleteUserEmail, setDeleteUserEmail] = useState('')
    const [enableDeleteUser, setEnableDeleteUser] = useState(false)

    useEffect(() => {
        if (deleteUserEmail === session?.user?.email) setEnableDeleteUser(true)
        else setEnableDeleteUser(false)
    }, [deleteUserEmail])

    return (
        <View style={styles.darkBackground}>
            <View style={styles.deleteUserWarning}>
                <Text style={styles.h2}>WARNING!!</Text>
                <Text style={styles.input}>
                    You are deleting your account. If you are sure this is what you want, please enter your email.
                </Text>
                <Input
                    label="Email"
                    style={styles.input}
                    onChangeText={(text) => setDeleteUserEmail(text)}
                />
                <Button
                    title="Cancel"
                    onPress={() => setDeleteUserWarning(false)}
                    color={Colours.primary[Colours.theme]}
                    disabled={loading}
                />
                <Button
                    title="Delete Account"
                    onPress={() => deleteUser(session, setLoading)}
                    color={Colours.red[Colours.theme]}
                    disabled={loading || !enableDeleteUser}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    darkBackground: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 100,
    },
    deleteUserWarning: {
        position: "absolute",
        alignSelf: "center",
        top: "30%",
        backgroundColor: Colours.dealItem[Colours.theme],
        display: "flex",
        width: "85%",
        padding: 10,
    },
    h2: {
        fontSize: 23,
        fontWeight: 'bold',
        color: Colours.text[Colours.theme],
        alignSelf: "center",
        fontFamily: Fonts.condensed,
    },
    input: {
        color: Colours.text[Colours.theme],
        fontFamily: Fonts.condensed,
    },
})
