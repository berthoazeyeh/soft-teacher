import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { selectLanguageValue, useTheme } from 'store';
import { Theme } from 'utils';
import 'moment/locale/fr';
import { useSelector } from 'react-redux';

const CustomDatePickerForm = props => {
  const { theme } = props;
  const styles = dynamicStyles(theme);
  const [date, setDate] = useState(
    (props.date && moment(props.date)) || moment(),
  );
  const language = useSelector(selectLanguageValue);

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (date) {
      props.onDateChange(date.toDate());
    }
  }, [date]);
  moment.locale(language);

  const onAndroidChange = (e, selectDate) => {
    setShow(false);
    if (selectDate) {
      setDate(moment(selectDate));
    }
  };
  // console.log(date);

  const onChange = (e, selectDate) => {
    setDate(moment(selectDate));
  };

  const renderDatePicker = () => {
    return (
      <DateTimePicker
        timeZoneOffsetInMinutes={0}
        value={date ? new Date(date) : new Date()}
        mode="date"
        display="calendar"
        maximumDate={new Date()}
        onChange={Platform.OS === 'ios' ? onChange : onAndroidChange}
      />
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.containerDatePicker}
      onPress={() => setShow(true)}>
      <View style={styles.viewDatePicker}>
        <Text style={styles.datePicker}>{props?.date ? moment(props?.date).format('dddd DD MMMM') : moment().format('ddd DD MMMM')}</Text>
        {show && renderDatePicker()}
      </View>
    </TouchableOpacity>
  );
};

export default CustomDatePickerForm;

const dynamicStyles = (theme) => {
  return StyleSheet.create({
    containerDatePicker: {
      paddingVertical: 18,
      paddingHorizontal: 15,
    },
    viewDatePicker: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    datePickerPlacerHoler: {
      fontSize: 17,
    },
    datePicker: {
      color: theme.primaryText,
      ...Theme.fontStyle.inter.bold,
      fontSize: 18,
    },
  });
};
