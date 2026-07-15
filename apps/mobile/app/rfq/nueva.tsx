import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";

import { Button } from "../../src/components/button";
import { Card } from "../../src/components/Card";
import { Screen } from "../../src/components/Screen";
import { colors } from "../../src/theme/colors";

interface FormValues {
  titulo: string;
  descripcion: string;
  cantidad: string;
  presupuesto: string;
  fechaLimite: string;
}

type FormErrors = Partial<Record<keyof FormValues | "attachments", string>>;

const initialValues: FormValues = {
  titulo: "",
  descripcion: "",
  cantidad: "",
  presupuesto: "",
  fechaLimite: "",
};

const allowedDocumentTypes = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/*",
];

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function NuevaRfqScreen() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [attachments, setAttachments] = useState<
    DocumentPicker.DocumentPickerAsset[]
  >([]);
  const [submitting, setSubmitting] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(() => new Date());

  const selectedDateLabel = values.fechaLimite
    ? dateFormatter.format(new Date(`${values.fechaLimite}T12:00:00`))
    : "Seleccionar fecha";

  const calendarDays = useMemo(
    () => buildCalendarDays(calendarDate),
    [calendarDate],
  );

  const updateValue = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handlePickFiles = async () => {
    if (attachments.length >= 5) {
      setErrors((current) => ({
        ...current,
        attachments: "Puedes adjuntar maximo 5 archivos.",
      }));
      return;
    }

    const result = await DocumentPicker.getDocumentAsync({
      type: allowedDocumentTypes,
      multiple: true,
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return;
    }

    const availableSlots = 5 - attachments.length;
    const nextFiles = result.assets.slice(0, availableSlots);

    setAttachments((current) => [...current, ...nextFiles]);
    setErrors((current) => ({
      ...current,
      attachments:
        result.assets.length > availableSlots
          ? "Solo se agregaron los primeros 5 archivos permitidos."
          : undefined,
    }));
  };

  const handleRemoveAttachment = (uri: string) => {
    setAttachments((current) => current.filter((file) => file.uri !== uri));
    setErrors((current) => ({ ...current, attachments: undefined }));
  };

  const handleSelectDate = (date: Date) => {
    updateValue("fechaLimite", toDateInputValue(date));
    setDatePickerOpen(false);
  };

  const handleSubmit = async () => {
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      router.replace("/rfqs");
    } catch {
      Alert.alert("Error", "No se pudo crear la RFQ. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen scroll style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Nueva solicitud</Text>
        <Text style={styles.title}>Crear RFQ</Text>
        <Text style={styles.subtitle}>
          Completa la informacion para recibir cotizaciones de proveedores.
        </Text>
      </View>

      <Card style={styles.formCard}>
        <Field
          label="Titulo"
          value={values.titulo}
          onChangeText={(value) => updateValue("titulo", value)}
          error={errors.titulo}
          placeholder="Ej. Compra de materiales para obra"
        />

        <Field
          label="Descripcion"
          value={values.descripcion}
          onChangeText={(value) => updateValue("descripcion", value)}
          error={errors.descripcion}
          placeholder="Describe los productos, condiciones y alcance"
          multiline
          inputStyle={styles.textArea}
        />

        <View style={styles.row}>
          <Field
            label="Cantidad"
            value={values.cantidad}
            onChangeText={(value) => updateValue("cantidad", onlyNumbers(value))}
            error={errors.cantidad}
            placeholder="0"
            keyboardType="numeric"
            containerStyle={styles.rowField}
          />

          <Field
            label="Presupuesto"
            value={values.presupuesto}
            onChangeText={(value) =>
              updateValue("presupuesto", onlyDecimalNumbers(value))
            }
            error={errors.presupuesto}
            placeholder="0"
            keyboardType="numeric"
            containerStyle={styles.rowField}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Fecha limite</Text>
          <Pressable
            onPress={() => setDatePickerOpen(true)}
            style={[
              styles.dateButton,
              !!errors.fechaLimite && styles.inputError,
            ]}
          >
            <Text
              style={[
                styles.dateText,
                !values.fechaLimite && styles.placeholderText,
              ]}
            >
              {selectedDateLabel}
            </Text>
          </Pressable>
          {!!errors.fechaLimite && (
            <Text style={styles.errorText}>{errors.fechaLimite}</Text>
          )}
        </View>

        <View style={styles.attachmentsHeader}>
          <View>
            <Text style={styles.label}>Adjuntos</Text>
            <Text style={styles.helperText}>PDF, Excel o imagenes. Maximo 5.</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.75}
            disabled={attachments.length >= 5}
            onPress={handlePickFiles}
            style={[
              styles.attachButton,
              attachments.length >= 5 && styles.disabled,
            ]}
          >
            <Text style={styles.attachButtonText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        {attachments.length > 0 && (
          <View style={styles.attachmentList}>
            {attachments.map((file) => (
              <View key={file.uri} style={styles.attachmentItem}>
                <View style={styles.attachmentCopy}>
                  <Text style={styles.attachmentName} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Text style={styles.attachmentMeta}>
                    {formatFileSize(file.size)}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => handleRemoveAttachment(file.uri)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>Quitar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {!!errors.attachments && (
          <Text style={styles.errorText}>{errors.attachments}</Text>
        )}

        <Button
          label="Crear RFQ"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          style={styles.submitButton}
        />
      </Card>

      <DatePickerModal
        visible={datePickerOpen}
        monthDate={calendarDate}
        selectedValue={values.fechaLimite}
        days={calendarDays}
        onClose={() => setDatePickerOpen(false)}
        onSelect={handleSelectDate}
        onPrevMonth={() => setCalendarDate(addMonths(calendarDate, -1))}
        onNextMonth={() => setCalendarDate(addMonths(calendarDate, 1))}
      />
    </Screen>
  );
}

interface FieldProps extends React.ComponentProps<typeof TextInput> {
  label: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

function Field({
  label,
  error,
  containerStyle,
  inputStyle,
  multiline,
  ...props
}: FieldProps) {
  return (
    <View style={[styles.field, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textSecondary}
        multiline={multiline}
        style={[
          styles.input,
          multiline && styles.multilineInput,
          !!error && styles.inputError,
          inputStyle,
        ]}
        {...props}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

interface DatePickerModalProps {
  visible: boolean;
  monthDate: Date;
  selectedValue: string;
  days: Array<Date | null>;
  onClose: () => void;
  onSelect: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

function DatePickerModal({
  visible,
  monthDate,
  selectedValue,
  days,
  onClose,
  onSelect,
  onPrevMonth,
  onNextMonth,
}: DatePickerModalProps) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalBackdrop}>
        <Card style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={onPrevMonth} style={styles.monthButton}>
              <Text style={styles.monthButtonText}>Anterior</Text>
            </TouchableOpacity>
            <Text style={styles.calendarTitle}>
              {dateFormatter.format(monthDate).replace(/\d+\sde\s/i, "")}
            </Text>
            <TouchableOpacity onPress={onNextMonth} style={styles.monthButton}>
              <Text style={styles.monthButtonText}>Siguiente</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekRow}>
            {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
              <Text key={`${day}-${index}`} style={styles.weekDay}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {days.map((date, index) => {
              const value = date ? toDateInputValue(date) : "";
              const selected = value === selectedValue;

              return (
                <Pressable
                  key={`${value}-${index}`}
                  disabled={!date}
                  onPress={() => date && onSelect(date)}
                  style={[
                    styles.dayCell,
                    selected && styles.dayCellSelected,
                    !date && styles.dayCellEmpty,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selected && styles.dayTextSelected,
                    ]}
                  >
                    {date?.getDate() ?? ""}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Button label="Cerrar" variant="outline" onPress={onClose} />
        </Card>
      </View>
    </Modal>
  );
}

function validate(values: FormValues): FormErrors {
  const nextErrors: FormErrors = {};

  if (!values.titulo.trim()) {
    nextErrors.titulo = "El titulo es obligatorio.";
  }

  if (!values.descripcion.trim()) {
    nextErrors.descripcion = "La descripcion es obligatoria.";
  }

  if (!values.cantidad.trim()) {
    nextErrors.cantidad = "La cantidad es obligatoria.";
  } else if (Number(values.cantidad) <= 0) {
    nextErrors.cantidad = "Ingresa una cantidad mayor a 0.";
  }

  if (!values.presupuesto.trim()) {
    nextErrors.presupuesto = "El presupuesto es obligatorio.";
  } else if (Number(values.presupuesto) <= 0) {
    nextErrors.presupuesto = "Ingresa un presupuesto mayor a 0.";
  }

  if (!values.fechaLimite) {
    nextErrors.fechaLimite = "La fecha limite es obligatoria.";
  }

  return nextErrors;
}

function buildCalendarDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const mondayFirstOffset = (firstDay.getDay() + 6) % 7;
  const days: Array<Date | null> = Array.from(
    { length: mondayFirstOffset },
    () => null,
  );

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function onlyNumbers(value: string) {
  return value.replace(/\D/g, "");
}

function onlyDecimalNumbers(value: string) {
  return value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
}

function formatFileSize(size?: number) {
  if (!size) {
    return "Tamano no disponible";
  }

  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

const styles = StyleSheet.create({
  screen: {
    padding: 16,
    paddingBottom: 28,
  },
  header: {
    gap: 6,
    marginBottom: 18,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 21,
  },
  formCard: {
    gap: 2,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  multilineInput: {
    minHeight: 112,
    textAlignVertical: "top",
  },
  textArea: {
    lineHeight: 21,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowField: {
    flex: 1,
  },
  dateButton: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 12,
  },
  dateText: {
    color: colors.text,
    fontSize: 16,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  attachmentsHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },
  attachButton: {
    borderColor: colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  attachButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.45,
  },
  attachmentList: {
    gap: 8,
  },
  attachmentItem: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    padding: 10,
  },
  attachmentCopy: {
    flex: 1,
  },
  attachmentName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  attachmentMeta: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  removeButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  removeButtonText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: "700",
  },
  submitButton: {
    marginTop: 18,
  },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(26, 25, 23, 0.45)",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  calendarCard: {
    width: "100%",
    maxWidth: 420,
    gap: 14,
  },
  calendarHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  calendarTitle: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    textTransform: "capitalize",
  },
  monthButton: {
    minWidth: 76,
    paddingVertical: 8,
  },
  monthButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  weekRow: {
    flexDirection: "row",
  },
  weekDay: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 6,
  },
  dayCell: {
    alignItems: "center",
    aspectRatio: 1,
    justifyContent: "center",
    width: "14.285%",
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  dayCellEmpty: {
    opacity: 0,
  },
  dayText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  dayTextSelected: {
    color: colors.white,
  },
});
