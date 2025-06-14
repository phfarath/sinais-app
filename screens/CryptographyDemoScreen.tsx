import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, Clipboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Importar serviços de segurança
import { EncryptionService } from '../services/EncryptionService';
import { DataSanitizer } from '../services/DataSanitizer';
import { AuditService } from '../services/AuditService';

export default function CryptographyDemoScreen() {
  const insets = useSafeAreaInsets();
  
  // Estados para demonstração
  const [email, setEmail] = useState('usuario@exemplo.com');
  const [password, setPassword] = useState('minhaSenh@123');  const [maliciousInput, setMaliciousInput] = useState('<script>alert("XSS Attack!");</script><img src="x" onerror="alert(\'Hack!\')" />Dados do usuário');
  
  // Estados dos resultados
  const [encryptionResults, setEncryptionResults] = useState<any>({});
  const [xssResults, setXssResults] = useState<any>({});
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const copyToClipboard = (text: string, label: string) => {
    if (Clipboard && Clipboard.setString) {
      Clipboard.setString(text);
      Alert.alert('📋 Copiado', `${label} copiado para a área de transferência`);
    } else {
      Alert.alert('📋 Dados', `${label}: ${text.substring(0, 100)}...`);
    }
  };

  const demonstrateCryptography = async () => {
    try {
      // 1. DEMONSTRAÇÃO DE CRIPTOGRAFIA DE DADOS SENSÍVEIS
      const userData = {
        email: email,
        password: password,
        cpf: '123.456.789-00',
        dadosBancarios: {
          conta: '12345-6',
          agencia: '0001',
          banco: 'Banco Exemplo'
        }
      };      // Criptografar dados
      const userDataString = JSON.stringify(userData);
      const encryptedData = EncryptionService.encryptData(userDataString);
      
      // Hash da senha
      const hashedPassword = await EncryptionService.hashPassword(password);
      
      // Descriptografar para verificar integridade
      const decryptedData = EncryptionService.decryptData(encryptedData);      setEncryptionResults({
        originalData: userData,
        encryptedData: encryptedData,
        hashedPassword: hashedPassword,
        decryptedData: JSON.parse(decryptedData),
        encryptionSuccessful: userDataString === decryptedData,
        encryptedLength: encryptedData.length,
        originalLength: userDataString.length
      });

      // Log de auditoria
      AuditService.logAction('CRYPTO_DEMO', 'DATA_ENCRYPTION', 'demo-user', {
        action: 'encrypt_user_data',
        dataTypes: ['email', 'password', 'cpf', 'banking'],
        success: true
      }, 'LOW');

      Alert.alert('✅ Criptografia', 'Dados criptografados com sucesso! Veja os resultados abaixo.');

    } catch (error) {
      Alert.alert('❌ Erro', 'Falha na demonstração de criptografia');
      console.error(error);
    }
  };

  const demonstrateXSSProtection = () => {
    try {
      // 2. DEMONSTRAÇÃO DE PROTEÇÃO CONTRA XSS
      const testInputs = [
        maliciousInput,
        '<img src=x onerror=alert("XSS")>',
        '<svg onload=alert("XSS")>',
        'javascript:alert("XSS")',
        '<iframe src="javascript:alert(\'XSS\')"></iframe>',
        'normal text without scripts'
      ];      const results = testInputs.map(input => {
        const sanitized = DataSanitizer.sanitizeUserInput(input);
        return {
          original: input,
          sanitized: sanitized,
          blocked: input !== sanitized,
          threat: input.includes('<script>') || input.includes('javascript:') || input.includes('onerror') || input.includes('onload')
        };
      });

      setXssResults({
        testCases: results,
        totalTests: results.length,
        threatsBlocked: results.filter(r => r.blocked).length,
        safeInputs: results.filter(r => !r.threat).length
      });

      // Log de auditoria para tentativas de XSS
      AuditService.logAction('XSS_PROTECTION_DEMO', 'SECURITY_TEST', 'demo-user', {
        action: 'test_xss_protection',
        inputsTestedCount: results.length,
        threatsDetected: results.filter(r => r.threat).length,
        threatsBlocked: results.filter(r => r.blocked).length
      }, 'MEDIUM');

      Alert.alert('🛡️ Proteção XSS', `${results.filter(r => r.blocked).length} ameaças bloqueadas de ${results.length} testes!`);

    } catch (error) {
      Alert.alert('❌ Erro', 'Falha na demonstração de proteção XSS');
      console.error(error);
    }
  };

  const loadAuditLogs = () => {
    const logs = AuditService.getLogs('demo-user');
    setAuditLogs(logs.slice(-10)); // Últimos 10 logs
  };
  const runFullDemo = async () => {
    await demonstrateCryptography();
    setTimeout(() => {
      demonstrateXSSProtection();
      setTimeout(() => {
        loadAuditLogs();
      }, 500);
    }, 1000);
  };

  // Função para copiar resultados para área de transferência
  const copyResultsForPDF = () => {
    const results = {
      timestamp: new Date().toLocaleString('pt-BR'),
      cryptographyDemo: {
        email: email,
        password: '[PROTEGIDO]',
        encryption: encryptionResults.encryptedData ? 'Dados criptografados com AES-256' : 'Não executado',
        hash: encryptionResults.hashedPassword ? 'Hash SHA-256 gerado' : 'Não executado',
        status: encryptionResults.encryptionSuccessful ? 'SUCESSO' : 'PENDENTE'
      },
      xssProtection: {
        inputMalicioso: maliciousInput,
        threatsBloqueadas: xssResults.threatsBlocked || 0,
        totalTestes: xssResults.totalTests || 0,
        protectionRate: ((xssResults.threatsBlocked || 0) / (xssResults.totalTests || 1) * 100).toFixed(1) + '%'
      },
      auditoria: {
        logsGerados: auditLogs.length,
        ultimaAtualizacao: auditLogs[0]?.timestamp || 'N/A'
      }
    };

    const formattedResults = `
🔐 RELATÓRIO DE DEMONSTRAÇÃO DE CYBERSECURITY
Gerado em: ${results.timestamp}

📊 CRIPTOGRAFIA AES-256:
• Email testado: ${results.cryptographyDemo.email}
• Status da criptografia: ${results.cryptographyDemo.status}
• Algoritmo: AES-256 + SHA-256

🛡️ PROTEÇÃO CONTRA XSS:
• Input malicioso: ${results.xssProtection.inputMalicioso}
• Ameaças bloqueadas: ${results.xssProtection.threatsBloqueadas}/${results.xssProtection.totalTestes}
• Taxa de proteção: ${results.xssProtection.protectionRate}

📋 AUDITORIA:
• Logs gerados: ${results.auditoria.logsGerados}
• Última atualização: ${results.auditoria.ultimaAtualizacao}

✅ CONFORMIDADE LGPD: Dados protegidos com criptografia
✅ TRANSPARÊNCIA: Logs de auditoria completos
✅ SEGURANÇA: Proteção contra ataques XSS
`;

    copyToClipboard(formattedResults, 'Relatório de Demonstração');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.header}
      >
        <MaterialCommunityIcons name="shield-key" size={48} color="white" />
        <Text style={styles.headerTitle}>Demo de Criptografia e Segurança</Text>
        <Text style={styles.headerSubtitle}>
          Teste criptografia AES e proteção contra XSS
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Seção de Entrada de Dados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Dados para Teste</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email:</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite um email"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Senha:</Text>
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Digite uma senha"
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Entrada Maliciosa (XSS Test):</Text>
            <TextInput
              style={[styles.textInput, styles.maliciousInput]}
              value={maliciousInput}
              onChangeText={setMaliciousInput}
              placeholder="Digite código malicioso para teste"
              multiline
            />
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.primaryButton} onPress={runFullDemo}>
            <MaterialCommunityIcons name="play-circle" size={24} color="white" />
            <Text style={styles.primaryButtonText}>Executar Demo Completa</Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={demonstrateCryptography}>
              <MaterialCommunityIcons name="key-variant" size={20} color="#4A90E2" />
              <Text style={styles.secondaryButtonText}>Teste Criptografia</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={demonstrateXSSProtection}>
              <MaterialCommunityIcons name="shield-check" size={20} color="#EF4444" />
              <Text style={styles.secondaryButtonText}>Teste XSS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Resultados da Criptografia */}
        {Object.keys(encryptionResults).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔐 Resultados da Criptografia</Text>
            
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Dados Originais:</Text>
              <Text style={styles.codeText}>{JSON.stringify(encryptionResults.originalData, null, 2)}</Text>
            </View>

            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Dados Criptografados (AES):</Text>
              <Text style={[styles.codeText, styles.encryptedText]}>{encryptionResults.encryptedData}</Text>
            </View>

            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Hash da Senha (SHA256):</Text>
              <Text style={[styles.codeText, styles.hashText]}>{encryptionResults.hashedPassword}</Text>
            </View>

            <View style={styles.statusCard}>
              <MaterialCommunityIcons 
                name={encryptionResults.encryptionSuccessful ? "check-circle" : "alert-circle"} 
                size={24} 
                color={encryptionResults.encryptionSuccessful ? "#10B981" : "#EF4444"} 
              />
              <Text style={styles.statusText}>
                Criptografia: {encryptionResults.encryptionSuccessful ? 'Bem-sucedida' : 'Falhou'}
              </Text>
            </View>

            <Text style={styles.infoText}>
              Tamanho original: {encryptionResults.originalLength} caracteres{'\n'}
              Tamanho criptografado: {encryptionResults.encryptedLength} caracteres
            </Text>
          </View>
        )}

        {/* Resultados da Proteção XSS */}
        {Object.keys(xssResults).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🛡️ Resultados da Proteção XSS</Text>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Resumo dos Testes:</Text>
              <Text style={styles.summaryText}>
                Total de testes: {xssResults.totalTests}{'\n'}
                Ameaças bloqueadas: {xssResults.threatsBlocked}{'\n'}
                Entradas seguras: {xssResults.safeInputs}
              </Text>
            </View>

            {xssResults.testCases?.map((test: any, index: number) => (
              <View key={index} style={styles.testCase}>
                <View style={styles.testHeader}>
                  <MaterialCommunityIcons 
                    name={test.threat ? (test.blocked ? "shield-check" : "alert") : "check"} 
                    size={20} 
                    color={test.threat ? (test.blocked ? "#10B981" : "#EF4444") : "#6B7280"} 
                  />
                  <Text style={styles.testTitle}>
                    Teste {index + 1} {test.threat ? (test.blocked ? '(Ameaça Bloqueada)' : '(Ameaça Detectada)') : '(Entrada Segura)'}
                  </Text>
                </View>
                
                <Text style={styles.testLabel}>Original:</Text>
                <Text style={[styles.codeText, styles.originalText]}>{test.original}</Text>
                
                <Text style={styles.testLabel}>Sanitizado:</Text>
                <Text style={[styles.codeText, styles.sanitizedText]}>{test.sanitized}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Logs de Auditoria */}
        {auditLogs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Logs de Auditoria</Text>
            
            {auditLogs.map((log, index) => (
              <View key={index} style={styles.logEntry}>
                <View style={styles.logHeader}>
                  <Text style={styles.logTimestamp}>
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </Text>
                  <Text style={[styles.logLevel, { color: log.severity === 'HIGH' ? '#EF4444' : log.severity === 'MEDIUM' ? '#F59E0B' : '#10B981' }]}>
                    {log.severity}
                  </Text>
                </View>
                <Text style={styles.logAction}>{log.action}</Text>
                <Text style={styles.logDetails}>{JSON.stringify(log.details, null, 2)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Explicações Técnicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Explicações Técnicas</Text>
          
          <View style={styles.explanationCard}>
            <Text style={styles.explanationTitle}>🔐 Criptografia AES</Text>
            <Text style={styles.explanationText}>
              • Utiliza algoritmo AES (Advanced Encryption Standard){'\n'}
              • Chave secreta armazenada em variáveis de ambiente{'\n'}
              • Dados são convertidos para JSON, criptografados e codificados em Base64{'\n'}
              • Permite descriptografia para verificação de integridade
            </Text>
          </View>

          <View style={styles.explanationCard}>
            <Text style={styles.explanationTitle}>🛡️ Proteção XSS</Text>
            <Text style={styles.explanationText}>
              • Remove tags HTML maliciosas (&lt;script&gt;, &lt;iframe&gt;, etc.){'\n'}
              • Bloqueia atributos de evento (onload, onerror, onclick){'\n'}
              • Filtra URLs com protocolo javascript:{'\n'}
              • Mantém texto normal sem alterações
            </Text>
          </View>

          <View style={styles.explanationCard}>
            <Text style={styles.explanationTitle}>📋 Auditoria</Text>
            <Text style={styles.explanationText}>
              • Registra todas as operações de segurança{'\n'}
              • Inclui timestamp, usuário, ação e detalhes{'\n'}
              • Níveis de severidade: LOW, MEDIUM, HIGH{'\n'}
              • Permite rastreamento completo para compliance
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginTop: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: 'white',
  },
  maliciousInput: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
    minHeight: 60,
  },
  buttonSection: {
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 6,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#374151',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  encryptedText: {
    color: '#7C3AED',
    backgroundColor: '#F3F4F6',
  },
  hashText: {
    color: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#065F46',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  summaryCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#1E3A8A',
    lineHeight: 20,
  },
  testCase: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  testLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
  },
  originalText: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  sanitizedText: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  logEntry: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logTimestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  logLevel: {
    fontSize: 12,
    fontWeight: '600',
  },
  logAction: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  logDetails: {
    fontSize: 10,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  explanationCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});
