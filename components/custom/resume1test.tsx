import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

interface Achievement {
    title: string;
    details: string[];
}

interface WorkExperience {
    company: string;
    position: string;
    location: string;
    duration: string;
    details: string[];
}

interface Project {
    name: string;
    details: string[];
}

interface Education {
    school: string;
    degree: string;
    location: string;
    duration: string;
}

export interface ResumeData {
    name: string;
    email: string;
    phone: string;
    location: string;
    introduction: string;
    workExperience: WorkExperience[];
    projects: Project[];
    skills: string[];
    achievements: Achievement[],
    education: Education[],
    languages: string[]
}

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 11,
        fontFamily: 'Helvetica', // Changed font family
    },
    header: {
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        marginBottom: 5,
    },
    title: {
        fontSize: 14,
        fontWeight: 'normal',
        marginBottom: 15,
    },
    contact: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 10,
        fontSize: 10,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 12,
        borderBottom: 1,
        borderBottomColor: '#000000',
        paddingBottom: 3,
    },
    position: {
        fontStyle: 'normal', // Removed italic
        fontWeight: 'normal'
    },
    workHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
        fontWeight: "bold",
        fontSize: 10,
    },
    bullet: {
        marginLeft: 15,
        marginBottom: 2,
        fontSize: 10,
    },
    skillsGrid: {
        flexDirection: 'row',
        flexWrap: "wrap",
        gap: 10,
    },
    section: {
        marginBottom: 15
    },
    companyName: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    companyDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 10,
        marginBottom: 5,
    },
});

export const Resumeformat1: React.FC<{ data: ResumeData }> = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.name}>{data.name}</Text>
                <Text style={styles.title}>Mechanical Engineer</Text>
                <View style={styles.contact}>
                    <Text>Phone: {data.phone}</Text>
                    <Text>Email: {data.email}</Text>
                    <Text>Address: {data.location}</Text>
                </View>
            </View>

            <View style={styles.section}>
                {data.workExperience.length > 0 &&
                    <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
                }
                {data.workExperience.map((work, index) => (
                    <View key={index} style={{ marginBottom: 10 }}>
                        <View style={styles.workHeader}>
                            <Text style={styles.companyName}>{work.position} | {work.duration}</Text>
                        </View>
                        <View style={styles.workHeader}>
                            <Text>{work.company}</Text>
                        </View>
                        {work.details.map((detail, i) => (
                            <View key={i} style={styles.bullet}>
                                <Text>• {detail}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                {
                    data.education.length > 0 &&
                    <Text style={styles.sectionTitle}>EDUCATION</Text>
                }
                {data.education.map((edu, index) => (
                    <View key={index} style={{ marginBottom: 10 }}>
                        <View style={styles.workHeader}>
                            <Text>{edu.school} | {edu.duration}</Text>
                        </View>
                        <View style={styles.workHeader}>
                            <Text>{edu.degree}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>CERTIFICATES</Text>
                <View style={styles.skillsGrid}>
                    {data.achievements.map((achievement, index) => (
                        <Text key={index}>{achievement.title}</Text>
                    ))}
                </View>
            </View>

        </Page>
    </Document>
);
