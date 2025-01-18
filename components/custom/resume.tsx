import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

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

interface ResumeData {
    name: string;
    email: string;
    phone: string;
    location: string;
    introduction: string;
    workExperience: WorkExperience[];
    projects: Project[];
    skills: string[];
    education: Education;
}

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 11,
        fontFamily: 'Times-Roman',
    },
    header: {
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        marginBottom: 5,
    },
    contact: {
        flexDirection: 'row',
        gap: 5,
        marginBottom: 10,
        fontSize: 11,
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
        fontStyle: 'italic',
    },
    workHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
        fontWeight: "bold",
    },
    bullet: {
        marginLeft: 15,
        marginBottom: 2,
    },
    skillsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 30,
    },
});

export const ResumePDF: React.FC<{ data: ResumeData }> = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.name}>{data.name}</Text>
                <View style={styles.contact}>
                    <Text>{data.email}</Text>
                    <Text>-</Text>
                    <Text>{data.phone}</Text>
                    <Text>-</Text>
                    <Text>{data.location}</Text>
                </View>
                {data.introduction && <Text>{data.introduction}</Text>}
            </View>

            <Text style={styles.sectionTitle}>WORK EXPERIENCE</Text>
            {data.workExperience.map((work, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                    <View style={styles.workHeader}>
                        <Text>{work.company}</Text>
                        <Text>{work.duration}</Text>
                    </View>
                    <View style={styles.workHeader}>
                        <Text style={styles.position}>{work.position}</Text>
                        <Text>{work.location}</Text>
                    </View>
                    {work.details.map((detail, i) => (
                        <View key={i} style={styles.bullet}>
                            <Text>• {detail}</Text>
                        </View>
                    ))}
                </View>
            ))}

            <Text style={styles.sectionTitle}>PROJECTS</Text>
            {data.projects.map((project, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>{project.name}</Text>
                    {project.details.map((detail, i) => (
                        <View key={i} style={styles.bullet}>
                            <Text>• {detail}</Text>
                        </View>
                    ))}
                </View>
            ))}

            <Text style={styles.sectionTitle}>SKILLS</Text>
            <View style={styles.skillsGrid}>
                {data.skills.map((skill, index) => (
                    <Text key={index}>{skill}</Text>
                ))}
            </View>

            <Text style={styles.sectionTitle}>EDUCATION</Text>
            <View>
                <View style={styles.workHeader}>
                    <Text>{data.education.school}</Text>
                    <Text>{data.education.duration}</Text>
                </View>
                <View style={styles.workHeader}>
                    <Text style={styles.position}>{data.education.degree}</Text>
                    <Text>{data.education.location}</Text>
                </View>
            </View>
        </Page>
    </Document>
);