import streamlit as st

st.title("Streamlit Metric Example")

# Display a single metric
st.metric(label="Temperature", value="30°C", delta="+2°C")

# You can show multiple metrics in columns
col1, col2, col3 = st.columns(3)

col1.metric(label="Revenue", value="$10K", delta="+5%")
col2.metric(label="Users", value="1,500", delta="-2%")
col3.metric(label="Conversion Rate", value="3.2%", delta="+0.5%")
