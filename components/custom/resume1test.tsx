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
    education: Education[];
    languages: string[];
}

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 11,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333',
    },
    contact: {
        fontSize: 11,
        flexDirection: 'column',
        gap: 5,
        fontWeight: 'normal',
    },
    title: {
        fontSize: 14,
        fontWeight: 'normal',
        marginBottom: 10,
        color: '#555',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 12,
        borderBottom: 1,
        borderBottomColor: '#000000',
        paddingBottom: 3,
    },
    section: {
        marginBottom: 20,
    },
    workHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    companyName: {
        fontWeight: 'bold',
    },
    companyDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 10,
        marginBottom: 5,
    },
    skillsGrid: {
        flexDirection: 'row',
        flexWrap: "wrap",
        gap: 12,
        fontSize: 10,
    },
    bullet: {
        marginLeft: 15,
        marginBottom: 5,
        fontSize: 11,
    },
});

export const ResumeFormat1: React.FC<{ data: ResumeData }> = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header Section */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.name}>{data.name}</Text>
                    <br />
                    <Text style={styles.title}>{data.introduction}</Text>
                </View>
                <View style={styles.contact}>
                    <Text>{data.phone}</Text>
                    <Text>{data.email}</Text>
                    <Text>{data.location}</Text>
                </View>
            </View>

            {/* Work Experience Section */}
            <View style={styles.section}>
                {data.workExperience.length > 0 &&
                    <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
                }
                {data.workExperience.map((work, index) => (
                    <View key={index} style={{ marginBottom: 15 }}>
                        <View style={styles.workHeader}>
                            <Text style={styles.companyName}>{work.company}</Text>
                            <Text>{work.duration}</Text>
                        </View>
                        <View style={styles.workHeader}>
                            <Text>{work.position}</Text>
                            <Text>{work.location}</Text>
                        </View>
                        {work.details.map((detail, i) => (
                            <View key={i} style={styles.bullet}>
                                <Text>• {detail}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>

            {/* Education Section */}
            <View style={styles.section}>
                {data.education.length > 0 &&
                    <Text style={styles.sectionTitle}>EDUCATION</Text>
                }
                {data.education.map((edu, index) => (
                    <View key={index} style={{ marginBottom: 15 }}>
                        <View style={styles.workHeader}>
                            <Text>{edu.school}</Text>
                            <Text>{edu.duration}</Text>
                        </View>
                        <View style={styles.workHeader}>
                            <Text>{edu.degree}</Text>
                            <Text>{edu.location}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Skills Section */}
            <View style={styles.section}>
                {data.skills.length > 0 &&
                    <Text style={styles.sectionTitle}>SKILLS</Text>
                }
                <View style={styles.skillsGrid}>
                    {data.skills.map((skill, index) => (
                        <Text key={index}>{skill}</Text>
                    ))}
                </View>
            </View>

            {/* Achievements Section */}
            <View style={styles.section}>
                {data.achievements.length > 0 &&
                    <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
                }
                {data.achievements.map((achievement, index) => (
                    <View key={index} style={{ marginBottom: 15 }}>
                        <Text style={{ fontWeight: 'bold' }}>{achievement.title}</Text>
                        {achievement.details.map((detail, i) => (
                            <View key={i} style={styles.bullet}>
                                <Text>• {detail}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>

            {/* Projects Section */}
            <View style={styles.section}>
                {data.projects.length > 0 &&
                    <Text style={styles.sectionTitle}>PROJECTS</Text>
                }
                {data.projects.map((project, index) => (
                    <View key={index} style={{ marginBottom: 15 }}>
                        <Text style={{ fontWeight: 'bold' }}>{project.name}</Text>
                        {project.details.map((detail, i) => (
                            <View key={i} style={styles.bullet}>
                                <Text>• {detail}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>

            {/* Languages Section */}
            <View style={styles.section}>
                {data.languages.length > 0 &&
                    <Text style={styles.sectionTitle}>LANGUAGES</Text>
                }
                <View style={styles.skillsGrid}>
                    {data.languages.map((lang, index) => (
                        <Text key={index}>{lang}</Text>
                    ))}
                </View>
            </View>
        </Page>
    </Document>
);
