import { StyleSheet, Text, View } from "react-native";
import { Deal_t } from "../operations/Deal";
import colours from "../config/Colours";
import { getWeekdays } from "../config/Weekdays";
import { formatTime, formatDate } from "../config/FormatDateTime";


export default function getDiscountDescription(deal: Deal_t) {
  switch (deal.type) {
    case 0: // Classic bonus point type discount
      return (
        <View>
          <Text style={styles.discountText}>
            <Text style={styles.discountAmount}>{deal.percentage}%</Text>
            {" off\nwhen you come "}
            <Text style={styles.discountTime}>{deal.max_pts} times</Text>
          </Text>
          <Text style={[styles.discountText, styles.left]}>
            - {getWeekdays(deal.days) + "\n"}
            - {formatTime(deal.start_time) + " to " + formatTime(deal.end_time) + "\n"}
            {deal.end_date == null ? "" : `- valid until ${formatDate(deal.end_date)}`}
          </Text>
        </View>
      )
    case 1: // Limited-time discount
      return (
        <View>
          <Text style={styles.discountText}>
            <Text style={styles.discountAmount}>{deal.percentage}%</Text>
            {" off"}
          </Text>
          <Text style={[styles.discountText, styles.left]}>
            - {getWeekdays(deal.days) + "\n"}
            - {formatTime(deal.start_time) + " to " + formatTime(deal.end_time) + "\n"}
            {deal.end_date == null ? "" : `- valid until ${formatDate(deal.end_date)}`}
          </Text>
        </View>
      )
  }
}

const styles = StyleSheet.create({
  discountAmount: {
    color: colours.gold[colours.theme],
  },
  discountText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginHorizontal: 20,
    textAlign: "center",
    paddingTop: 15,
    color: colours.text[colours.theme],
  },
  discountTime: {
    color: colours.green[colours.theme],
  },
  left: {
    textAlign: "left",
    fontSize: 15,
  }
});
